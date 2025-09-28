const fs = require('fs');
const path = require('path');

function optimizeBuild() {
  const buildPath = path.join(__dirname, '../build');
  
  if (!fs.existsSync(buildPath)) {
    console.log('Build folder does not exist');
    return;
  }

  // Удаляем source maps
  const staticPath = path.join(buildPath, 'static');
  if (fs.existsSync(staticPath)) {
    const jsPath = path.join(staticPath, 'js');
    const cssPath = path.join(staticPath, 'css');
    
    // Удаляем .map файлы
    [jsPath, cssPath].forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.endsWith('.map')) {
            const filePath = path.join(dir, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Removed: ${file}`);
            } catch (error) {
              console.log(`Could not remove ${file}:`, error.message);
            }
          }
        });
      }
    });
  }

  // Удаляем ненужные файлы
  const filesToRemove = [
    'robots.txt',
    'manifest.json',
    'logo192.png',
    'logo512.png'
  ];

  filesToRemove.forEach(file => {
    const filePath = path.join(buildPath, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Removed: ${file}`);
      } catch (error) {
        console.log(`Could not remove ${file}:`, error.message);
      }
    }
  });

  console.log('Build optimization completed');
}

// Если скрипт запущен напрямую
if (require.main === module) {
  optimizeBuild();
}

module.exports = optimizeBuild;
