// Content script to detect job application submissions
console.log('Job Application Tracker: Content script loaded');

// Common job application form patterns
const JOB_SITES = {
  linkedin: 'linkedin.com',
  indeed: 'indeed.com',
  glassdoor: 'glassdoor.com',
  greenhouse: 'greenhouse.io',
  lever: 'lever.co',
  workday: 'myworkdayjobs.com',
  smartrecruiters: 'smartrecruiters.com',
  jobvite: 'jobvite.com',
  taleo: 'taleo.net'
};

// Keywords that indicate a job application
const APPLICATION_KEYWORDS = [
  'apply',
  'submit application',
  'send application',
  'submit resume',
  'apply now',
  'submit',
  'application',
  'job application'
];

// Track form submissions
let formSubmitted = false;

// Function to detect if current page is a job site
function isJobSite() {
  const hostname = window.location.hostname.toLowerCase();
  return Object.values(JOB_SITES).some(site => hostname.includes(site));
}

// Function to check if form is likely a job application
function isJobApplicationForm(form) {
  const formText = form.innerText.toLowerCase();
  const formAction = (form.action || '').toLowerCase();
  const formId = (form.id || '').toLowerCase();
  const formClass = (form.className || '').toLowerCase();
  
  // Check for job application keywords
  const hasKeywords = APPLICATION_KEYWORDS.some(keyword => 
    formText.includes(keyword) || 
    formAction.includes(keyword) ||
    formId.includes(keyword) ||
    formClass.includes(keyword)
  );
  
  // Check for resume/CV upload fields
  const hasFileUpload = form.querySelector('input[type="file"]') !== null;
  const hasResumeField = formText.includes('resume') || formText.includes('cv');
  
  return hasKeywords || (hasFileUpload && hasResumeField);
}

// Function to extract application data
function extractApplicationData(form) {
  const data = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    site: window.location.hostname,
    company: '',
    position: '',
    formData: {}
  };
  
  // Try to extract company and position from page
  data.company = extractCompanyName();
  data.position = extractPositionTitle();
  
  // Extract form fields
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const name = input.name || input.id || input.placeholder;
    if (name && input.value && input.type !== 'password') {
      data.formData[name] = input.type === 'file' ? 'FILE_UPLOADED' : input.value;
    }
  });
  
  return data;
}

// Extract company name from page
function extractCompanyName() {
  // Try common selectors
  const selectors = [
    '[class*="company"]',
    '[class*="employer"]',
    '[data-company]',
    'h1, h2, h3'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText.trim();
      if (text && text.length < 100) {
        return text;
      }
    }
  }
  
  return 'Unknown Company';
}

// Extract position title from page
function extractPositionTitle() {
  // Try to find job title in common locations
  const title = document.title;
  const h1 = document.querySelector('h1');
  
  if (h1 && h1.innerText) {
    return h1.innerText.trim();
  }
  
  if (title) {
    return title.split('|')[0].split('-')[0].trim();
  }
  
  return 'Unknown Position';
}

// Monitor form submissions
function monitorForms() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    
    if (isJobApplicationForm(form)) {
      console.log('Job application form detected!');
      
      const applicationData = extractApplicationData(form);
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'JOB_APPLICATION_SUBMITTED',
        data: applicationData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('Application tracked successfully');
        }
      });
      
      formSubmitted = true;
    }
  });
}

// Monitor AJAX/fetch requests (for single-page applications)
function monitorAjaxRequests() {
  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    
    if (options.method === 'POST' && isJobSite()) {
      console.log('POST request detected on job site:', url);
      
      // Check if it might be a job application submission
      if (typeof url === 'string' && 
          (url.includes('apply') || url.includes('application') || url.includes('submit'))) {
        
        const applicationData = {
          url: window.location.href,
          timestamp: new Date().toISOString(),
          site: window.location.hostname,
          company: extractCompanyName(),
          position: extractPositionTitle(),
          apiEndpoint: url
        };
        
        chrome.runtime.sendMessage({
          type: 'JOB_APPLICATION_SUBMITTED',
          data: applicationData
        });
      }
    }
    
    return originalFetch.apply(this, args);
  };
}

// Initialize monitoring
if (isJobSite() || window.location.href.includes('career') || window.location.href.includes('jobs')) {
  console.log('Job site detected, monitoring for applications...');
  monitorForms();
  monitorAjaxRequests();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_PAGE') {
    sendResponse({
      isJobSite: isJobSite(),
      url: window.location.href
    });
  }
});

