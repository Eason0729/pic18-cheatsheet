const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Function to recursively find all .html files in a directory
function findHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  const htmlFiles = [];

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      htmlFiles.push(...findHtmlFiles(fullPath));
    } else if (path.extname(file).toLowerCase() === '.html') {
      htmlFiles.push(fullPath);
    }
  });

  return htmlFiles;
}

// Recursive function to remove comments from a node and its children
function removeComments(node) {
  // Remove comments from the current node's childNodes
  if (node.hasChildNodes()) {
    const childNodes = Array.from(node.childNodes); // Copy to avoid mutation issues during iteration
    childNodes.forEach(child => {
      if (child.nodeType === 8) { // Node.COMMENT_NODE
        child.remove();
      } else {
        removeComments(child); // Recurse into child elements
      }
    });
  }
}

// Function to remove script tags and comments from a single HTML file
function sanitizeFile(filePath) {
  try {
    // Read the file
    let htmlContent = fs.readFileSync(filePath, 'utf8');

    // Create a JSDOM window to parse the full HTML (preserves DOCTYPE and structure)
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Find and remove all <script> tags
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Remove all HTML comments recursively from the entire document
    removeComments(document);

    // Serialize the entire document back to HTML string
    // This preserves DOCTYPE, <html>, <head>, <body>, etc.
    const cleanHtml = dom.serialize();

    // Write the cleaned HTML back to the file
    fs.writeFileSync(filePath, cleanHtml, 'utf8');

    console.log(`✅ Sanitized: ${filePath} (Removed ${scripts.length} scripts)`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

// Main execution
const folderPath = process.argv[2] || './dist';
console.log(`🔍 Scanning folder: ${path.resolve(folderPath)}`);

const htmlFiles = findHtmlFiles(folderPath);
console.log(`📁 Found ${htmlFiles.length} HTML files.`);

if (htmlFiles.length === 0) {
  console.log('No HTML files found.');
} else {
  htmlFiles.forEach(sanitizeFile);
  console.log('🎉 Sanitization complete!');
}
