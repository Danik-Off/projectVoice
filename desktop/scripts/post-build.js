const fs = require('fs');
const path = require('path');

function copyElectronFiles() {
  try {
    const sourceDir = path.join(__dirname, '../electron');
    const targetDir = path.join(__dirname, '../build/electron');
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy all files from electron directory to build/electron
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      if (fs.statSync(sourcePath).isFile()) {
        if (file === 'main.js') {
          // Create production version of main.js with correct paths
          let content = fs.readFileSync(sourcePath, 'utf8');
          
          // Fix paths for production build
          content = content.replace(
            "icon: path.join(__dirname, '../build/favicon.ico'),",
            "icon: path.join(__dirname, '../favicon.ico'),"
          );
          
          fs.writeFileSync(targetPath, content);
          console.log(`Created production version of ${file} with correct paths`);
        } else {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied ${file} to build/electron/`);
        }
      }
    });
    
    // Fix index.html for Electron - replace relative paths with absolute paths
    const indexPath = path.join(__dirname, '../build/index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Replace relative paths with absolute paths for Electron
    indexContent = indexContent.replace(/\.\/static\//g, './static/');
    indexContent = indexContent.replace(/\.\/favicon\.ico/g, './favicon.ico');
    indexContent = indexContent.replace(/\.\/logo192\.png/g, './logo192.png');
    indexContent = indexContent.replace(/\.\/manifest\.json/g, './manifest.json');
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed index.html paths for Electron');
    
    // Create electron.js entry point
    const electronEntryPath = path.join(__dirname, '../build/electron.js');
    const electronEntryContent = "// Entry point for Electron app\nrequire('./electron/main.js');";
    fs.writeFileSync(electronEntryPath, electronEntryContent);
    console.log('Created electron.js entry point');
    
    console.log('Electron files copied successfully to build directory');
  } catch (error) {
    console.error('Error copying electron files:', error);
    process.exit(1);
  }
}

// If script is run directly
if (require.main === module) {
  copyElectronFiles();
}

module.exports = copyElectronFiles;
