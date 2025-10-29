# 📋 Job Application Tracker - Project Overview

## What is this?

A React-based browser extension that automatically detects when you submit job applications and keeps track of them in one place. No more spreadsheets!

## Key Features

### 🎯 Automatic Detection
- Monitors form submissions on job sites
- Detects AJAX/fetch requests for single-page applications
- Works across popular job boards (LinkedIn, Indeed, Glassdoor, etc.)

### 📊 Beautiful Dashboard
- View all applications in one place
- Statistics: total apps, this week, this month
- Modern, gradient-based UI
- Export data as JSON

### 🔔 Smart Notifications
- Desktop notifications when applications are tracked
- Never lose track of where you applied

### 🔒 Privacy First
- All data stored locally on your device
- No external servers or data transmission
- No tracking, no analytics

## Project Structure

```
job/
├── manifest.json              # Extension configuration
├── package.json               # Node.js dependencies
├── .gitignore                 # Git ignore rules
│
├── public/                    # Static files
│   ├── index.html            # Popup HTML
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Background service worker
│   ├── content.js            # Content script (detection logic)
│   └── icons/                # Extension icons
│       ├── icon16.svg
│       ├── icon48.svg
│       └── icon128.svg
│
├── src/                       # React source files
│   ├── index.js              # React entry point
│   ├── index.css             # Global styles
│   ├── App.js                # Main React component
│   └── App.css               # App styles
│
├── scripts/                   # Build and setup scripts
│   ├── setup.sh              # One-command setup
│   ├── copy-files.js         # Build helper
│   ├── generate-icons.js     # Icon generator
│   └── create-placeholder-icons.html  # Icon creator tool
│
├── README.md                  # Full documentation
├── QUICK_START.md            # Quick start guide
└── PROJECT_OVERVIEW.md       # This file
```

## How It Works

### 1. Content Script (`public/content.js`)
- Injected into all web pages
- Monitors form submissions
- Detects job application patterns
- Extracts application data
- Sends data to background script

### 2. Background Script (`public/background.js`)
- Runs in the background
- Receives data from content script
- Stores applications in Chrome storage
- Sends notifications
- Handles popup requests

### 3. Popup UI (`src/App.js`)
- React-based interface
- Displays tracked applications
- Shows statistics
- Allows data export
- Delete/clear functionality

## Technology Stack

- **React 18** - UI framework
- **Chrome Extension API** - Browser integration
- **Chrome Storage API** - Local data storage
- **Chrome Notifications API** - Desktop notifications
- **Vanilla JS** - Content and background scripts

## Detection Logic

The extension uses multiple strategies to detect job applications:

1. **Form Analysis**
   - Checks for job-related keywords (apply, resume, cv)
   - Identifies file upload fields
   - Matches against known job sites

2. **URL Pattern Matching**
   - Recognizes common job site domains
   - Detects career/jobs pages

3. **AJAX Interception**
   - Intercepts fetch requests
   - Identifies POST requests to application endpoints

4. **Data Extraction**
   - Company name from page headings
   - Job title from H1 or page title
   - Form fields (excluding passwords)
   - Timestamp and URL

## Supported Job Sites

Out of the box, the extension recognizes:
- LinkedIn
- Indeed
- Glassdoor
- Greenhouse
- Lever
- Workday
- SmartRecruiters
- Jobvite
- Taleo Oracle
- Any site with "career" or "jobs" in URL

## Data Storage

Applications are stored in Chrome's local storage:
```javascript
{
  id: "timestamp",
  url: "job posting URL",
  timestamp: "ISO date string",
  site: "hostname",
  company: "Company Name",
  position: "Job Title",
  formData: { /* non-sensitive form fields */ }
}
```

## Build Process

1. **React Build** (`npm run build`)
   - Compiles React app
   - Bundles JavaScript
   - Optimizes for production

2. **File Copy** (`scripts/copy-files.js`)
   - Copies manifest.json
   - Copies background.js
   - Copies content.js
   - Copies icons

3. **Output** (`build/` directory)
   - Ready-to-load extension
   - All files in place
   - Can be zipped for distribution

## Customization Ideas

### Easy Customizations
- Change colors in `src/App.css`
- Modify detection keywords in `public/content.js`
- Add more supported job sites
- Customize notifications

### Advanced Customizations
- Add application status tracking (Applied, Interview, Rejected, Offer)
- Implement cloud sync
- Add reminders and follow-ups
- Create analytics and charts
- Add notes and tags to applications
- Export to CSV/Excel
- Email integration

## Development Workflow

1. Make changes to source files
2. Run `npm run build`
3. Reload extension in Chrome (click reload icon)
4. Test changes

For continuous development:
1. Use `npm start` for React hot reload (but note: this won't work as an extension)
2. Build and reload for testing actual extension functionality

## Testing Tips

1. **Test on Multiple Sites**
   - Try different job boards
   - Test with different application forms
   - Check both traditional and modern SPA sites

2. **Check Console Logs**
   - Content script logs appear in page console
   - Background script logs in extension service worker console
   - Popup logs in popup inspect console

3. **Test Data Persistence**
   - Submit applications
   - Close and reopen popup
   - Restart browser
   - Verify data persists

## Publishing (Future)

To publish to Chrome Web Store:
1. Zip the `build` directory
2. Create developer account
3. Upload zip file
4. Fill out store listing
5. Submit for review

## Contributing

Ideas for contributions:
- Additional job site support
- Enhanced detection algorithms
- UI improvements
- New features (status tracking, reminders, etc.)
- Bug fixes
- Documentation improvements

## License

MIT License - Use freely for personal or commercial projects

## Support

For issues or questions:
1. Check console logs for errors
2. Verify you're on a supported job site
3. Ensure extension has necessary permissions
4. Try rebuilding and reloading

---

**Happy job hunting! 🚀**

Remember: It's not about the quantity of applications, but finding the right fit. This tool just helps you keep track! 💪

