// Background service worker for the extension
console.log('Job Application Tracker: Background script loaded');

// Store applications in chrome.storage
const STORAGE_KEY = 'jobApplications';

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (!result[STORAGE_KEY]) {
      chrome.storage.local.set({ [STORAGE_KEY]: [] });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'JOB_APPLICATION_SUBMITTED') {
    console.log('Job application submitted:', request.data);
    
    // Save application to storage
    saveApplication(request.data)
      .then(() => {
        // Show notification
        showNotification(request.data);
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error('Error saving application:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'GET_APPLICATIONS') {
    getApplications()
      .then((applications) => {
        sendResponse({ applications });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'DELETE_APPLICATION') {
    deleteApplication(request.id)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Will respond asynchronously
  }

  if (request.type === 'CLEAR_ALL_APPLICATIONS') {
    clearAllApplications()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Will respond asynchronously
  }
});

// Save application to storage
async function saveApplication(applicationData) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      
      const applications = result[STORAGE_KEY] || [];
      
      // Add unique ID
      applicationData.id = Date.now().toString();
      
      // Add to beginning of array
      applications.unshift(applicationData);
      
      // Save back to storage
      chrome.storage.local.set({ [STORAGE_KEY]: applications }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}

// Get all applications
async function getApplications() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEY] || []);
      }
    });
  });
}

// Delete a specific application
async function deleteApplication(id) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      
      const applications = result[STORAGE_KEY] || [];
      const filtered = applications.filter(app => app.id !== id);
      
      chrome.storage.local.set({ [STORAGE_KEY]: filtered }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}

// Clear all applications
async function clearAllApplications() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: [] }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// Show notification
function showNotification(applicationData) {
  const title = '🎉 Job Application Tracked!';
  const message = `Application for ${applicationData.position} at ${applicationData.company}`;
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message,
    priority: 2
  });
}

