#!/bin/bash

# Setup script for Job Application Tracker Extension

echo "🚀 Setting up Job Application Tracker Extension..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Generate icons
echo "🎨 Generating icons..."
node scripts/generate-icons.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate icons"
    exit 1
fi

echo "✓ Icons generated"
echo ""

# Build the extension
echo "🔨 Building extension..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build extension"
    exit 1
fi

echo "✓ Extension built successfully"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup completed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo "1. Open Chrome/Edge and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'build' folder"
echo ""
echo "📂 Build folder location:"
echo "   $(pwd)/build"
echo ""
echo "Happy job hunting! 🎯"

