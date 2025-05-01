import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readFileSync, mkdirSync, watch, cpSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Files in the same order as background.html
const files = [
  'js/vapi-common.js',
  'js/vapi-background.js',
  'js/background.js',
  'js/autologin-platform.js',
  'js/utils.js',
  'js/security.js',
  'js/storage.js',
  'js/pagestore.js',
  'js/tab.js',
  'js/Helper.js',
  'js/global.js'
];

// Folders to copy to dist
const foldersToSync = [
  'js',
  'css',
  'images',
  '_locales',
  'faq'
  
];

const filesToSync = [
  'manifest.json',
  'background.html',
  'options.html'
];

// Initial setup function to copy all required files to dist
function initialSetup() {
  const distPath = join(__dirname, 'dist');
  console.log('Setting up dist directory...');
  
  // Create dist directory if it doesn't exist
  if (!existsSync(distPath)) {
    mkdirSync(distPath, { recursive: true });
  }

  // Copy folders
  for (const folder of foldersToSync) {
    const sourcePath = join(__dirname, folder);
    const targetPath = join(distPath, folder);
    if (existsSync(sourcePath)) {
      console.log(`Copying folder: ${folder}`);
      cpSync(sourcePath, targetPath, { recursive: true, force: true });
    }
  }

  // Copy individual files
  for (const file of filesToSync) {
    const sourcePath = join(__dirname, file);
    const targetPath = join(distPath, file);
    if (existsSync(sourcePath)) {
      console.log(`Copying file: ${file}`);
      cpSync(sourcePath, targetPath, { force: true });
    }
  }
}

// Function to copy a single changed file to dist
function syncChangedFile(filePath) {
  const relativePath = filePath.replace(__dirname + '/', '');
  const distPath = join(__dirname, 'dist', relativePath);
  const sourceFile = join(__dirname, relativePath);
  
  if (existsSync(sourceFile)) {
    console.log(`Syncing changed file: ${relativePath}`);
    mkdirSync(dirname(distPath), { recursive: true });
    cpSync(sourceFile, distPath, { force: true });
  }
}

// Debounce function
let timeoutId = null;
function debounce(func, wait) {
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      console.log('Debouncing build...');
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(this, args);
    }, wait);
  };
}

const debouncedBuild = debounce(buildBundle, 5000); // 5 seconds delay

async function buildBundle() {
  try {
    console.log('Starting bundling process...');
    const startTime = performance.now();
    
    // Read and combine all files
    const combinedContent = files.map(file => {
      const content = readFileSync(join(__dirname, file), 'utf8');
      return `
// Source: ${file}
(function() {
${content}
})();
`;
    }).join('\n');

    // Write directly to dist folder
    const distOutDir = join(__dirname, 'dist');
    mkdirSync(distOutDir, { recursive: true });
    const outFile = join(distOutDir, 'background-bundle.js');
    writeFileSync(outFile, combinedContent, 'utf8');

    const buildTime = Math.round(performance.now() - startTime);
    console.log(`✨ Bundle written directly to ${outFile} in ${buildTime}ms!`);
  } catch (err) {
    console.error('Bundling failed:', err);
    if (!process.argv.includes('--watch')) {
      process.exit(1);
    }
  }
}

if (process.argv.includes('--watch')) {
  console.log('Initial setup...');
  initialSetup();
  buildBundle();
  
  console.log('Watching for changes...');
  
  // Watch the entire project directory for changes
  watch(__dirname, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    // Ignore dist directory changes to prevent infinite loops
    if (filename.startsWith('dist/')) return;
    
    // If it's a JS file in the watched list, trigger rebuild
    if (files.some(file => filename === file)) {
      console.log(`JS source changed: ${filename} - scheduling rebuild in 5s...`);
      debouncedBuild();
    } else {
      // For other files, just copy them to dist
      syncChangedFile(filename);
    }
  });
} else {
  console.log('Running one-time build...');
  initialSetup();
  buildBundle();
}