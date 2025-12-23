const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const timestamp = Math.floor(Date.now() / 1000);

// Regex to find the style.css link, handling potential existing query params
// It looks for href="css/style.css" or href="css/style.css?v=..."
const regex = /href="css\/style\.css(\?v=[^"]*)?"/;

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        if (regex.test(content)) {
            const newLink = `href="css/style.css?v=${timestamp}"`;
            content = content.replace(regex, newLink);
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${path.basename(filePath)} with version ${timestamp}`);
        } else {
            // Only warn if it looks like an HTML file that SHOULD have it, otherwise silent
            console.log(`No style.css link found in ${path.basename(filePath)}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('UserId to ensure scanning directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error stating file:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    processDirectory(filePath);
                } else if (path.extname(file) === '.html') {
                    updateFile(filePath);
                }
            });
        });
    });
}

console.log('Starting cache busting...');
processDirectory(publicDir);
