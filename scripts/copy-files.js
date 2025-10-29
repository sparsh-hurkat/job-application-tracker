const fs = require('fs');
const path = require('path');

// Source and destination directories
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const rootDir = path.join(__dirname, '..');

// Files to copy from public directory
const publicFiles = [
  'background.js',
  'content.js'
];

// Files to copy from root directory
const rootFiles = [
  'manifest.json'
];

console.log('Copying extension files to build directory...');

// Copy files from public directory
publicFiles.forEach(file => {
  const src = path.join(publicDir, file);
  const dest = path.join(buildDir, file);
  
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    } else {
      console.warn(`⚠ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error copying ${file}:`, error.message);
  }
});

// Copy files from root directory
rootFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(buildDir, file);
  
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    } else {
      console.warn(`⚠ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error copying ${file}:`, error.message);
  }
});

// Create icons directory if it doesn't exist
const iconsDir = path.join(buildDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✓ Created icons directory');
}

// Check if icons exist in public/icons, if so copy them
const publicIconsDir = path.join(publicDir, 'icons');
if (fs.existsSync(publicIconsDir)) {
  const icons = fs.readdirSync(publicIconsDir);
  icons.forEach(icon => {
    // Skip .DS_Store and other hidden files
    if (!icon.startsWith('.')) {
      const src = path.join(publicIconsDir, icon);
      const dest = path.join(iconsDir, icon);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied icon: ${icon}`);
      }
    }
  });
} else {
  console.warn('⚠ No icons directory found. Please create icons before loading the extension.');
}

console.log('\n✓ Build completed successfully!');
console.log('\nTo load the extension:');
console.log('1. Open Chrome/Edge and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log(`4. Select the "build" directory: ${buildDir}`);

