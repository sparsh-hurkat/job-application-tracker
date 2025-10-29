# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
cd /Users/sparshhurkat/Documents/visual\ studio\ code/jobs/job
npm install
```

## Step 2: Generate Icons

### Option A: Use the HTML Generator (Recommended)
1. Open `scripts/create-placeholder-icons.html` in your browser
2. Click the download buttons to save each icon
3. Save them as `icon16.png`, `icon48.png`, and `icon128.png`
4. Place them in the `public/icons/` folder

### Option B: Use SVG Icons (Already Generated)
The project already has SVG icons in `public/icons/`. These will work for development, but PNG is preferred for production.

### Option C: Create Custom Icons
Use any image editor to create:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

## Step 3: Build the Extension

```bash
npm run build
```

This will:
- Build the React app
- Copy all necessary files to the `build/` directory
- Prepare the extension for loading in Chrome

## Step 4: Load in Chrome/Edge

1. Open Chrome/Edge browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `build` folder: `/Users/sparshhurkat/Documents/visual studio code/jobs/job/build`

## Step 5: Test It Out!

1. Click the extension icon in your browser toolbar
2. Visit a job site (LinkedIn, Indeed, Glassdoor, etc.)
3. Submit a job application
4. Check the extension popup to see your tracked application!

## Troubleshooting

### Icons not showing?
- Make sure you have PNG or SVG files in `public/icons/`
- Rebuild with `npm run build`
- Reload the extension in Chrome

### Extension not detecting applications?
- Check the browser console for errors
- Make sure you're on a supported job site
- Try refreshing the page

### Build errors?
- Delete `node_modules` folder
- Run `npm install` again
- Make sure you're using Node.js 14+

## Development Mode

To make changes and test:

1. Edit files in `src/` or `public/`
2. Run `npm run build`
3. Click the reload icon on the extension in Chrome
4. Test your changes

## Supported Job Sites

The extension automatically detects applications on:
- LinkedIn
- Indeed
- Glassdoor
- Greenhouse
- Lever
- Workday
- And many more!

## Features to Try

- 📊 View statistics (total, this week, this month)
- 📋 See all your applications in one place
- 📥 Export your data as JSON
- 🔔 Get notifications when applications are tracked
- 🗑️ Delete individual applications or clear all

## Next Steps

- Customize the UI in `src/App.js` and `src/App.css`
- Add more job sites to the detection logic in `public/content.js`
- Enhance the tracking features in `public/background.js`

Happy job hunting! 🎯

