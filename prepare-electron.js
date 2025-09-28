const fs = require('fs-extra');
const path = require('path');

async function copyBackendFiles() {
    console.log('📁 Копируем backend файлы в Electron...');
    
    const sourceDir = path.join(__dirname, 'backend');
    const targetDir = path.join(__dirname, 'electron', 'backend');
    
    try {
        // Удаляем старую директорию если существует
        if (await fs.pathExists(targetDir)) {
            await fs.remove(targetDir);
        }
        
        // Копируем файлы
        await fs.copy(sourceDir, targetDir, {
            filter: (src) => {
                // Исключаем ненужные файлы
                return !src.includes('node_modules') && 
                       !src.includes('.git') && 
                       !src.includes('package-lock.json') &&
                       !src.includes('.env') && // Не копируем .env файлы
                       !src.includes('logs') &&
                       !src.includes('uploads');
            }
        });
        
        console.log('✅ Backend файлы скопированы успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при копировании backend файлов:', error);
        throw error;
    }
}

async function copyFrontendBuild() {
    console.log('📁 Копируем собранный frontend в Electron...');
    
    const sourceDir = path.join(__dirname, 'frontend', 'build');
    const targetDir = path.join(__dirname, 'electron', 'frontend', 'build');
    
    try {
        // Проверяем что frontend собран
        if (!await fs.pathExists(sourceDir)) {
            throw new Error('Frontend не собран! Запустите "npm run build" в папке frontend');
        }
        
        // Удаляем старую директорию если существует
        if (await fs.pathExists(targetDir)) {
            await fs.remove(targetDir);
        }
        
        // Копируем файлы
        await fs.copy(sourceDir, targetDir);
        
        console.log('✅ Frontend файлы скопированы успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при копировании frontend файлов:', error);
        throw error;
    }
}

async function updateElectronPackage() {
    console.log('📦 Обновляем package.json Electron...');
    
    const electronPackagePath = path.join(__dirname, 'electron', 'package.json');
    
    try {
        // Читаем оригинальный package.json
        const originalPackage = await fs.readJson(path.join(__dirname, 'package.json'));
        
        // Читаем Electron package.json
        const electronPackage = await fs.readJson(electronPackagePath);
        
        // Обновляем версию и описание
        electronPackage.version = originalPackage.version;
        electronPackage.description = originalPackage.description;
        
        // Сохраняем обновленный package.json
        await fs.writeJson(electronPackagePath, electronPackage, { spaces: 2 });
        
        console.log('✅ Package.json обновлен успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при обновлении package.json:', error);
        throw error;
    }
}

async function main() {
    try {
        await copyBackendFiles();
        await copyFrontendBuild();
        await updateElectronPackage();
        
        console.log('🎉 Electron приложение готово к использованию!');
        console.log('📝 Для запуска: cd electron && npm start');
        console.log('🔧 Для разработки: cd electron && npm run dev');
        
    } catch (error) {
        console.error('❌ Ошибка при подготовке Electron приложения:', error);
        process.exit(1);
    }
}

// Запускаем если скрипт вызван напрямую
if (require.main === module) {
    main();
}

module.exports = { copyBackendFiles, copyFrontendBuild, updateElectronPackage };
