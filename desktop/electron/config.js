const path = require('path');
const os = require('os');

const config = {
  // Основные настройки приложения
  app: {
    name: 'ProjectVoice Desktop',
    version: '1.0.0',
    description: 'Desktop version of ProjectVoice - voice chat application',
    author: 'Ovchinnikov Danila'
  },

  // Настройки окна
  window: {
    defaultWidth: 1200,
    defaultHeight: 800,
    minWidth: 800,
    minHeight: 600,
    center: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    alwaysOnTop: false,
    fullscreenable: true,
    skipTaskbar: false,
    titleBarStyle: 'default'
  },

  // Настройки веб-контента
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true,
    allowRunningInsecureContent: false,
    experimentalFeatures: false
  },

  // Настройки разработки
  development: {
    devTools: true,
    openDevToolsOnStart: true,
    hotReload: true,
    logLevel: 'debug'
  },

  // Настройки продакшена
  production: {
    devTools: false,
    openDevToolsOnStart: false,
    hotReload: false,
    logLevel: 'error'
  },

  // Пути к файлам
  paths: {
    userData: path.join(os.homedir(), '.projectvoice'),
    logs: path.join(os.homedir(), '.projectvoice', 'logs'),
    settings: path.join(os.homedir(), '.projectvoice', 'settings.json'),
    cache: path.join(os.homedir(), '.projectvoice', 'cache'),
    temp: path.join(os.homedir(), '.projectvoice', 'temp')
  },

  // Настройки сервера разработки
  devServer: {
    host: 'localhost',
    port: 3000,
    protocol: 'http'
  },

  // Настройки уведомлений
  notifications: {
    enabled: true,
    sound: true,
    duration: 5000,
    position: 'top-right'
  },

  // Настройки автозапуска
  autoLaunch: {
    enabled: false,
    hidden: false
  },

  // Настройки обновлений
  updates: {
    enabled: true,
    checkOnStart: true,
    checkInterval: 24 * 60 * 60 * 1000, // 24 часа
    autoDownload: false,
    autoInstall: false
  },

  // Настройки безопасности
  security: {
    allowExternalLinks: true,
    allowFileAccess: false,
    allowNavigation: false,
    allowNewWindows: false,
    allowPopups: false
  },

  // Настройки производительности
  performance: {
    hardwareAcceleration: true,
    backgroundThrottling: true,
    lowPowerMode: false,
    maxMemoryUsage: 512 * 1024 * 1024 // 512 MB
  },

  // Настройки темы
  theme: {
    default: 'system',
    available: ['light', 'dark', 'system'],
    accentColor: '#5865F2'
  },

  // Настройки языка
  language: {
    default: 'en',
    available: ['en', 'ru', 'es'],
    fallback: 'en'
  },

  // Настройки логирования
  logging: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    file: true,
    console: process.env.NODE_ENV === 'development',
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 5
  },

  // Настройки кэширования
  cache: {
    enabled: true,
    maxSize: 100 * 1024 * 1024, // 100 MB
    ttl: 24 * 60 * 60 * 1000 // 24 часа
  },

  // Настройки сетевого подключения
  network: {
    timeout: 30000, // 30 секунд
    retries: 3,
    keepAlive: true,
    userAgent: 'ProjectVoice Desktop/1.0.0'
  },

  // Настройки плагинов
  plugins: {
    enabled: true,
    autoLoad: false,
    sandbox: true
  }
};

module.exports = config;
