## Setup Instructions

### 1. Configure Your Settings

Copy the example configuration and add your details:

```bash
cp src/config.example.js src/config.js
```

Then edit `src/config.js` and fill in:
- **coverLetterTemplate**: Your cover letter template with placeholders
- **resume**: Your full resume text
- **geminiApiKey**: Your Google Gemini API key from https://aistudio.google.com/app/apikey

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key (free tier available)
3. Copy the key to your `config.js` file

### 3. Build the Extension

```bash
npm install
npm run build
```

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `build` directory

### 5. Usage

1. Navigate to a job posting page (LinkedIn, Indeed, etc.)
2. Open the extension
3. Go to the "Cover Letter" tab
4. The extension will auto-detect:
   - Company name
   - Job description
5. Click "Generate Cover Letter"
6. Review and download as PDF

### Security Note

⚠️ **IMPORTANT**: The `src/config.js` file contains your API keys and is in `.gitignore`. 
- Never commit `src/config.js` to git
- Keep your API keys confidential
- Only share `src/config.example.js` (the template without secrets)
