const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateVersion() {
  try {
    // Получаем версию из package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const version = packageJson.version;

    // Получаем хеш последнего коммита
    let gitHash = 'unknown';
    let gitDate = 'unknown';
    
    try {
      gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      gitDate = execSync('git log -1 --format=%cd --date=format:"%Y.%m.%d"', { encoding: 'utf8' }).trim();
    } catch (error) {
      console.warn('Warning: Could not get git information:', error.message);
    }

    // Создаем объект с версией
    const versionInfo = {
      version,
      gitHash,
      buildDate: gitDate,
      buildTimestamp: new Date().toISOString()
    };

    // Записываем в файл
    const outputPath = path.join(__dirname, '../src/version.json');
    fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));

    console.log('Version info generated:', versionInfo);
    return versionInfo;
  } catch (error) {
    console.error('Error generating version info:', error);
    process.exit(1);
  }
}

// Если скрипт запущен напрямую
if (require.main === module) {
  generateVersion();
}

module.exports = generateVersion;
