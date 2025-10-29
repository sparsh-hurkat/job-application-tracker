// Simple script to generate placeholder icons
// This creates data URLs that can be converted to PNG files

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to create SVG icon
function createSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" 
        font-weight="bold" fill="white" text-anchor="middle" 
        dominant-baseline="central">📋</text>
</svg>`;
}

// Generate SVG files
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Created icon${size}.svg`);
});

console.log('\n✓ SVG icons generated successfully!');
console.log('\nNote: For best results, convert these SVG files to PNG using an online tool or image editor:');
console.log('1. Visit https://cloudconvert.com/svg-to-png');
console.log('2. Upload each SVG file');
console.log('3. Download the PNG versions');
console.log('4. Replace the SVG files with PNG files in public/icons/');
console.log('\nAlternatively, the SVG files will work for development purposes.');

