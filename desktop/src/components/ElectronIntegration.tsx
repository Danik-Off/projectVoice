import React, { useEffect, useState } from 'react';
import { ElectronAPI } from '../types/electron';

interface ElectronIntegrationProps {
  children: React.ReactNode;
}

const ElectronIntegration: React.FC<ElectronIntegrationProps> = ({ children }) => {
  const [isElectron, setIsElectron] = useState(false);
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | null>(null);
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    // Проверяем, запущено ли приложение в Electron
    const checkElectron = () => {
      if (window.electronAPI) {
        setIsElectron(true);
        setElectronAPI(window.electronAPI);
        
        // Получаем версию приложения
        window.electronAPI.getVersion().then(version => {
          setAppVersion(version);
        }).catch(console.error);
      }
    };

    checkElectron();

    // Обработка событий меню
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((action) => {
        console.log('Menu action received:', action);
        // Здесь можно обработать действия меню
        switch (action) {
          case 'menu-new-server':
            // Логика создания нового сервера
            break;
          case 'menu-join-server':
            // Логика присоединения к серверу
            break;
          case 'menu-about':
            // Показать информацию о приложении
            alert(`ProjectVoice Desktop v${appVersion}`);
            break;
        }
      });
    }

    // Обработка изменения размера окна
    const handleResize = () => {
      if (window.electronAPI) {
        // Можно отправить информацию о размере в главный процесс
        console.log('Window resized:', window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('menu-action');
      }
    };
  }, [appVersion]);

  // Показываем индикатор, что приложение запущено в Electron
  if (isElectron) {
    return (
      <div className="electron-app">
        {children}
        <div className="electron-indicator">
          <span>🖥️ Desktop v{appVersion}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ElectronIntegration;
