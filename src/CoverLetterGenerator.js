import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { config } from './config';
/* global chrome */

function CoverLetterGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('input');

  useEffect(() => {
    extractPageInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractPageInfo = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'EXTRACT_PAGE_INFO' },
          (response) => {
            if (response && !chrome.runtime.lastError) {
              if (response.companyName) setCompanyName(response.companyName);
              if (response.jobDescription) setJobDescription(response.jobDescription);
            }
          }
        );
      }
    });
  };

  const generateCoverLetter = async () => {
    if (!config.geminiApiKey || config.geminiApiKey === 'your-gemini-api-key-here') {
      setError('Please set your Gemini API key in config.js');
      return;
    }

    if (!companyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide the job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Extract role type and relevant details from job description
      const roleAnalysis = analyzeJobRole(jobDescription, companyName);
      
      // Extract relevant projects and skills from resume based on role
      const relevantExperience = extractRelevantExperience(roleAnalysis.roleType);
      
      // Generate customized cover letter with more context
      const customizationPrompt = `You are an expert cover letter writer. Customize the following cover letter template for this specific role.

Company: ${companyName}
Detected Role: ${roleAnalysis.detectedRole}
Role Type: ${roleAnalysis.roleType}
Key Focus Areas: ${roleAnalysis.keyFocusAreas}

Relevant candidate experience:
${relevantExperience}

Original template structure to follow:
${config.coverLetterTemplate}

Instructions:
1. Keep the same overall structure and paragraph count
2. Update the role title to "${roleAnalysis.detectedRole}" (from the current generic role)
3. In the second paragraph, mention 2-3 specific projects/skills from the relevant experience that match this role
4. Replace [specific product, mission, tech stack, or engineering challenge] with something specific from the job description that aligns with the candidate's background
5. Keep the opening and closing paragraphs similar in style but personalized
6. Do NOT add new sections, just adapt existing ones
7. Maintain the professional yet personable tone

Generate the complete customized cover letter. Do NOT add explanations or metadata.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + config.geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: customizationPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4000, // Increased for fuller letter
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate cover letter');
      }

      const data = await response.json();
      const customizedLetter = data.candidates[0].content.parts[0].text.trim();
      
      setGeneratedLetter(customizedLetter);
      setActiveSection('preview');
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze job role to determine what type of role it is
  const analyzeJobRole = (description, company) => {
    const lowerDesc = description.toLowerCase();
    
    // Detect role type
    let roleType = 'fullstack';
    if (lowerDesc.includes('frontend') || lowerDesc.includes('react') || lowerDesc.includes('vue') || lowerDesc.includes('angular')) {
      roleType = 'frontend';
    } else if (lowerDesc.includes('backend') || lowerDesc.includes('api') || lowerDesc.includes('server')) {
      roleType = 'backend';
    } else if (lowerDesc.includes('machine learning') || lowerDesc.includes('ml ') || lowerDesc.includes('ai ') || lowerDesc.includes('data science')) {
      roleType = 'ml';
    } else if (lowerDesc.includes('devops') || lowerDesc.includes('cloud') || lowerDesc.includes('infrastructure')) {
      roleType = 'devops';
    } else if (lowerDesc.includes('full stack') || lowerDesc.includes('fullstack')) {
      roleType = 'fullstack';
    }
    
    // Extract detected role title from job description (usually first sentence)
    const roleMatch = description.match(/^([^\n.]+)/);
    let detectedRole = roleMatch ? roleMatch[1].trim() : 'Software Engineer';
    if (detectedRole.length > 100) {
      detectedRole = 'Software Engineer';
    }
    
    // Extract key focus areas
    const focusKeywords = {
      frontend: ['React', 'Vue', 'Angular', 'TypeScript', 'CSS', 'UI', 'UX', 'responsive', 'accessibility'],
      backend: ['Node.js', 'Java', 'Python', 'SQL', 'MongoDB', 'API', 'microservices', 'scalability'],
      ml: ['Python', 'TensorFlow', 'PyTorch', 'data', 'algorithms', 'neural', 'model', 'RAG', 'LLM'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'terraform', 'infrastructure', 'automation'],
      fullstack: ['React', 'Node.js', 'MongoDB', 'AWS', 'full stack', 'end-to-end', 'scalability']
    };
    
    const keywords = focusKeywords[roleType] || focusKeywords.fullstack;
    const keyFocusAreas = keywords.filter(kw => description.toLowerCase().includes(kw.toLowerCase())).slice(0, 5).join(', ');
    
    return {
      roleType,
      detectedRole,
      keyFocusAreas: keyFocusAreas || 'software development'
    };
  };

  // Extract relevant experience from resume based on role type
  const extractRelevantExperience = (roleType) => {
    const experiences = {
      frontend: [
        'Built reusable CMS-driven page components and migrated the main platform to Next.js, improving Lighthouse score, maintainability and scalability',
        'Led frontend development of a TypeScript/React vendor dashboard with real-time, large-scale data handling (50k+ transactions)',
        'Market Run project: Enhanced user interactivity in a React Native Pac-Man style game with real-time sensor integration'
      ],
      backend: [
        'Reduced backend API latency by 15% through Node.js and MongoDB optimizations',
        'Cut average user registration time by 5 minutes by optimizing a serverless onboarding microservice (SST, AWS Lambda, DynamoDB)',
        'Built real-time WebSocket-based systems that quadrupled verification throughput'
      ],
      ml: [
        'RAG Product Visualization System: Improved visual attribute-accuracy by 40% using multi-agent RAG + diffusion workflow, integrating FAISS retrieval and LLM-driven prompt refinement',
        'Built voice & chat virtual assistants using OpenAI APIs and Langchain',
        'Demonstrates experience with distributed systems and high-throughput backends'
      ],
      devops: [
        'Architected a multi-cloud autoscaling system using AWS EC2, Terraform, and GitHub Actions',
        'Recreated WeChat Spring-based microservice architecture with Docker, Kubernetes using Helm for CI/CD automation',
        'Enhanced system reliability with automated workflows and caching strategies'
      ],
      fullstack: [
        'Led the delivery of a full-stack partner platform from concept to production, generating ~$1.5M in first-year revenue',
        'Built modular, scalable architectures for complex workflows (Job Application Agent with microservices)',
        'Contributed across the stack: backend services, cloud infrastructure, and frontend systems'
      ]
    };

    const selected = experiences[roleType] || experiences.fullstack;
    return selected.map((exp, i) => `${i + 1}. ${exp}`).join('\n');
  };

  // Helper function to parse bold text (**text**) into segments
  const parseBoldText = (text) => {
    const segments = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: text.substring(lastIndex, match.index), bold: false });
      }
      segments.push({ text: match[1], bold: true });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({ text: text.substring(lastIndex), bold: false });
    }

    return segments.length > 0 ? segments : [{ text, bold: false }];
  };

  // Helper function to remove bold markdown from text (for clean text output)
  const cleanBoldMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  const downloadPDF = async () => {
    if (!generatedLetter) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      
      pdf.setFontSize(11);
      
      // Split by lines while preserving bold formatting
      const paragraphs = generatedLetter.split('\n');
      let yPosition = margin;
      const lineHeight = 6;
      
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          const segments = parseBoldText(paragraph);
          const lines = [];
          let currentLine = '';

          // Build lines while respecting bold segments
          segments.forEach((segment) => {
            const words = segment.text.split(' ');
            words.forEach((word) => {
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const testWidth = pdf.getStringUnitWidth(testLine) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
              
              if (testWidth > maxWidth && currentLine) {
                lines.push({ text: currentLine, bold: false });
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            });
            
            if (currentLine) {
              lines.push({ text: currentLine, bold: segment.bold });
              currentLine = '';
            }
          });

          // Render lines with proper bold formatting
          lines.forEach((line) => {
            if (yPosition + lineHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.setFont('Helvetica', line.bold ? 'bold' : 'normal');
            pdf.text(line.text, margin, yPosition);
            yPosition += lineHeight;
          });

          yPosition += 2; // Extra space between paragraphs
        }
      });

      pdf.save(`cover-letter-${companyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    }
  };

  return (
    <div className="cover-letter-section">
      <div className="letter-tabs">
        <button
          className={`letter-tab ${activeSection === 'input' ? 'active' : ''}`}
          onClick={() => setActiveSection('input')}
        >
          📝 Input
        </button>
        <button
          className={`letter-tab ${activeSection === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveSection('preview')}
          disabled={!generatedLetter}
        >
          👁️ Preview
        </button>
      </div>

      {activeSection === 'input' && (
        <div className="letter-input">
          <div className="input-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google, Microsoft, etc."
              className="input-field"
            />
            <small>Auto-detected from page when available</small>
          </div>

          <div className="input-group">
            <label htmlFor="jobDescription">Job Description *</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="input-field"
            />
            <small>This helps tailor the letter to the specific role</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn-primary"
            onClick={generateCoverLetter}
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Cover Letter'}
          </button>
        </div>
      )}

      {activeSection === 'preview' && generatedLetter && (
        <div className="letter-preview-section">
          <div id="letter-preview" className="letter-content">
            <div className="letter-text">
              {generatedLetter.split('\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '1em', lineHeight: '1.6' }}>
                  {parseBoldText(paragraph).map((segment, segIndex) => (
                    <span key={segIndex} style={{ fontWeight: segment.bold ? 'bold' : 'normal' }}>
                      {segment.text}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          <div className="preview-actions">
            <button
              className="btn-primary"
              onClick={downloadPDF}
            >
              📥 Download as PDF
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setGeneratedLetter('');
                setActiveSection('input');
              }}
            >
              ✏️ Generate New
            </button>
          </div>

          <div className="letter-info">
            <p>💡 Review the letter above before downloading. You can generate a new one if needed.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetterGenerator;
