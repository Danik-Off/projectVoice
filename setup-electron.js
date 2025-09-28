const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function setupElectronApp() {
    console.log('🚀 Настройка Electron приложения...');
    
    try {
        // 1. Создаем директории если их нет
        const electronDir = path.join(__dirname, 'electron');
        const backendDir = path.join(electronDir, 'backend');
        const frontendDir = path.join(electronDir, 'frontend');
        
        await fs.ensureDir(backendDir);
        await fs.ensureDir(frontendDir);
        
        // 2. Копируем backend файлы
        console.log('📁 Копируем backend файлы...');
        await fs.copy(path.join(__dirname, 'backend'), backendDir, {
            filter: (src) => {
                // Исключаем node_modules и другие ненужные файлы
                return !src.includes('node_modules') && 
                       !src.includes('.git') && 
                       !src.includes('package-lock.json');
            }
        });
        
        // 3. Собираем frontend
        console.log('🔨 Собираем frontend...');
        process.chdir(path.join(__dirname, 'frontend'));
        execSync('npm run build', { stdio: 'inherit' });
        
        // 4. Копируем собранный frontend
        console.log('📁 Копируем собранный frontend...');
        await fs.copy(
            path.join(__dirname, 'frontend', 'build'), 
            path.join(frontendDir, 'build')
        );
        
        // 5. Устанавливаем зависимости для Electron
        console.log('📦 Устанавливаем зависимости Electron...');
        process.chdir(electronDir);
        execSync('npm install', { stdio: 'inherit' });
        
        console.log('✅ Electron приложение настроено успешно!');
        console.log('📝 Для запуска используйте: cd electron && npm start');
        console.log('🔧 Для разработки используйте: cd electron && npm run dev');
        
    } catch (error) {
        console.error('❌ Ошибка при настройке Electron приложения:', error);
        process.exit(1);
    }
}

// Запускаем настройку если скрипт вызван напрямую
if (require.main === module) {
    setupElectronApp();
}

module.exports = setupElectronApp;
