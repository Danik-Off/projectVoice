const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let server;

// Функция для запуска легкого HTTP сервера в продакшн
function startLocalServer() {
  if (!isDev && !server) {
    const buildPath = path.join(__dirname, '..');
    
    server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = parsedUrl.pathname;
      
      // Если запрос к корню, возвращаем index.html
      if (pathname === '/') {
        pathname = '/index.html';
      }
      
      // Если запрос к файлу, который не существует, возвращаем index.html для SPA
      const filePath = path.join(buildPath, pathname);
      
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          // Файл не найден, возвращаем index.html для клиентской маршрутизации
          const indexPath = path.join(buildPath, 'index.html');
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('File not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
            }
          });
        } else {
          // Файл найден, отдаем его
          const ext = path.extname(filePath);
          const contentType = getContentType(ext);
          
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(500);
              res.end('Server error');
            } else {
              res.writeHead(200, { 'Content-Type': contentType });
              res.end(data);
            }
          });
        }
      });
    });
    
    // Запускаем сервер на порту 3001
    server.listen(3001, () => {
      console.log('Local server started on port 3001');
    });
  }
}

// Функция для определения типа контента
function getContentType(ext) {
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'application/octet-stream';
}

function createWindow() {
  // Создаем главное окно приложения
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, '../favicon.ico'),
    titleBarStyle: 'default',
    show: false
  });

  // Запускаем локальный сервер в продакшн режиме
  if (!isDev) {
    startLocalServer();
  }

  // Загружаем приложение
  const startUrl = isDev 
    ? 'http://localhost:3000/auth' 
    : 'http://localhost:3001/auth';
  
  mainWindow.loadURL(startUrl);

  // Показываем окно когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Открываем DevTools в режиме разработки
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Обработка закрытия окна
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Обработка внешних ссылок
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Предотвращаем навигацию на внешние сайты
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Разрешаем навигацию только в пределах localhost:3000 и localhost:3001
    if (parsedUrl.origin !== 'http://localhost:3000' && 
        parsedUrl.origin !== 'http://localhost:3001') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
}

// Создаем меню приложения
function createMenu() {
  // Устанавливаем пустое меню для скрытия строки меню
  Menu.setApplicationMenu(null);
}

// События приложения
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Закрываем сервер при закрытии приложения
    if (server) {
      server.close();
    }
    app.quit();
  }
});

// Обработка протокола приложения (для глубоких ссылок)
app.setAsDefaultProtocolClient('projectvoice');

// Обработка запуска приложения через протокол
app.on('open-url', (event, url) => {
  event.preventDefault();
  // Здесь можно обработать глубокие ссылки
  console.log('Deep link received:', url);
});

// Предотвращаем создание новых окон
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
