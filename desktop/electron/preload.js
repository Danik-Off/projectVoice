const { contextBridge, ipcRenderer } = require('electron');

// Безопасный API для взаимодействия между главным процессом и рендерером
contextBridge.exposeInMainWorld('electronAPI', {
  // Получение информации о платформе
  platform: process.platform,
  
  // Получение версии приложения
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Получение информации о системе
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Управление окном
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
  },
  
  // Уведомления
  notifications: {
    show: (title, body) => ipcRenderer.invoke('notification-show', { title, body }),
    isSupported: () => ipcRenderer.invoke('notification-supported')
  },
  
  // Файловая система (ограниченный доступ)
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs-read-file', path),
    writeFile: (path, data) => ipcRenderer.invoke('fs-write-file', { path, data }),
    exists: (path) => ipcRenderer.invoke('fs-exists', path)
  },
  
  // Настройки приложения
  settings: {
    get: (key) => ipcRenderer.invoke('settings-get', key),
    set: (key, value) => ipcRenderer.invoke('settings-set', { key, value }),
    getAll: () => ipcRenderer.invoke('settings-get-all'),
    reset: () => ipcRenderer.invoke('settings-reset')
  },
  
  // События меню
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  
  // Удаление слушателей
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Получение пути к пользовательским данным
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  
  // Проверка подключения к интернету
  isOnline: () => navigator.onLine,
  
  // Получение информации о дисплее
  getDisplayInfo: () => ipcRenderer.invoke('get-display-info'),
  
  // Управление автозапуском
  autoLaunch: {
    isEnabled: () => ipcRenderer.invoke('auto-launch-enabled'),
    enable: () => ipcRenderer.invoke('auto-launch-enable'),
    disable: () => ipcRenderer.invoke('auto-launch-disable')
  }
});

// Обработка событий клавиатуры для глобальных горячих клавиш
document.addEventListener('keydown', (event) => {
  // Передаем события клавиатуры в главный процесс
  if (event.ctrlKey || event.metaKey) {
    ipcRenderer.send('keyboard-shortcut', {
      key: event.key,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey
    });
  }
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  ipcRenderer.send('window-resized', {
    width: window.innerWidth,
    height: window.innerHeight
  });
});

// Обработка фокуса окна
window.addEventListener('focus', () => {
  ipcRenderer.send('window-focused');
});

window.addEventListener('blur', () => {
  ipcRenderer.send('window-blurred');
});

// Предотвращаем перетаскивание файлов на окно (для безопасности)
document.addEventListener('dragover', (event) => {
  event.preventDefault();
});

document.addEventListener('drop', (event) => {
  event.preventDefault();
});

console.log('Preload script loaded successfully');
