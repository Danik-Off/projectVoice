# ProjectVoice 🎤💬

> Современное веб-приложение для голосового и текстового общения в стиле Discord

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MobX](https://img.shields.io/badge/MobX-6.x-orange.svg)](https://mobx.js.org/)

**Автор:** Ovchinnikov Danila  
**Версия:** 1.0.0  
**Лицензия:** MIT License  

---

## 📋 Содержание

- [🚀 Особенности](#-особенности)
- [🛠️ Технологии](#️-технологии)
- [📦 Быстрая установка](#-быстрая-установка)
- [🏃‍♂️ Запуск](#️-запуск)
- [🌐 Доступ](#-доступ)
- [📁 Структура проекта](#-структура-проекта)
- [🔧 API Endpoints](#-api-endpoints)
- [💻 Разработка](#-разработка)
- [🚀 Деплой](#-деплой)
- [🤝 Участие в разработке](#-участие-в-разработке)
- [📄 Лицензия](#-лицензия)

---

## 🚀 Особенности

### 🎯 Основной функционал
- **🎤 Голосовые каналы** - WebRTC для качественного голосового общения
- **💬 Текстовые каналы** - Обмен сообщениями в реальном времени
- **🏰 Система серверов** - Создание и управление серверами
- **👥 Управление участниками** - Роли и права доступа
- **🔗 Приглашения** - Система приглашений в серверы
- **⚡ Real-time** - WebSocket для мгновенных обновлений

### 🎨 UI/UX особенности
- **🌙 Темная тема** - Щадящий для глаз дизайн
- **📱 Адаптивность** - Полная поддержка мобильных устройств
- **🎛️ Настройки аудио** - Детальная настройка микрофона и звука
- **🎨 Современный дизайн** - Градиенты, анимации, интерактивные элементы
- **🌍 Интернационализация** - Поддержка русского и английского языков

### 🔧 Технические особенности
- **🔐 JWT Authentication** - Безопасная аутентификация
- **📊 MobX State Management** - Реактивное управление состоянием
- **🎯 TypeScript** - Полная типизация для надежности
- **🔄 Hot Reload** - Быстрая разработка с автоперезагрузкой
- **📝 Swagger Documentation** - Автоматическая документация API

---

## 🛠️ Технологии

### Backend
```
🚀 Node.js + Express.js    # Серверная часть
🗄️ MySQL + Sequelize      # База данных и ORM
🔌 Socket.io              # WebSocket соединения
🎤 WebRTC                 # Голосовая связь
🔐 JWT + bcrypt           # Аутентификация и безопасность
📖 Swagger               # Документация API
```

### Frontend
```
⚛️  React 18 + TypeScript # Пользовательский интерфейс
📊 MobX                   # Управление состоянием
🎨 SCSS + CSS Variables   # Стилизация
🌍 React i18next          # Интернационализация
🔌 Socket.io-client       # Real-time соединения
🎤 WebRTC API             # Аудио/видео API
```

### DevOps & Tools
```
📦 npm workspaces         # Управление монорепозиторием
🔧 ESLint + Prettier      # Качество кода
🔄 Nodemon                # Автоперезагрузка сервера
📱 Responsive Design      # Адаптивная верстка
```

---

## 📦 Быстрая установка

### Предварительные требования
- **Node.js** >= 16.x
- **MySQL** >= 8.0
- **npm** >= 8.x
- **Git**

### 1. Клонирование репозитория
```bash
git clone https://github.com/yourusername/projectVoice.git
cd projectVoice
```

### 2. Установка зависимостей
```bash
# Установка всех зависимостей одной командой
npm run install:all
```

### 3. Настройка базы данных
```bash
# Создание базы данных и пользователя
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS test_projectvoice;
CREATE USER IF NOT EXISTS 'test_projectvoice'@'localhost' IDENTIFIED BY 'TZ8TSEWPet5kJnzN';
GRANT ALL PRIVILEGES ON test_projectvoice.* TO 'test_projectvoice'@'localhost';
FLUSH PRIVILEGES;
"
```

### 4. Настройка конфигурации
Создайте файл `backend/.env`:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
DB_HOST=localhost
DB_USER=test_projectvoice
DB_PASSWORD=TZ8TSEWPet5kJnzN
DB_NAME=test_projectvoice
```

### 5. Запуск миграций
```bash
cd backend
npm run db:migrate
cd ..
```

---

## 🏃‍♂️ Запуск

### Режим разработки
```bash
# Запуск всего приложения (фронтенд + бэкенд)
npm run start:all
```

### Раздельный запуск
```bash
# Только бэкенд (порт 5000)
npm run start:backend

# Только фронтенд (порт 3000)  
npm run start:frontend
```

### Производственный режим
```bash
# Сборка фронтенда
cd frontend && npm run build && cd ..

# Запуск бэкенда в продакшн режиме
cd backend && npm start
```

---

## 🌐 Доступ

После запуска приложение доступно по следующим адресам:

- **🌐 Веб-приложение**: http://localhost:3000
- **🔌 API сервер**: http://localhost:5000
- **📖 API документация**: http://localhost:5000/api-docs
- **📊 Swagger UI**: http://localhost:5000/api-docs

---

## 📁 Структура проекта

```
projectVoice/
├── 📦 package.json                 # Корневой package.json с скриптами
├── 📄 README.md                    # Документация проекта
├── 📜 LICENSE                      # MIT лицензия
│
├── 🗄️ backend/                     # Серверная часть
│   ├── 📦 package.json             # Зависимости бэкенда
│   ├── 🏗️ index.js                 # Точка входа сервера
│   ├── ⚙️ config/                  # Конфигурация
│   │   └── config.js               # Настройки БД
│   ├── 🛡️ middleware/              # Промежуточное ПО
│   │   ├── auth.js                 # JWT аутентификация
│   │   └── checkRole.js            # Проверка ролей
│   ├── 🔄 migrations/              # Миграции БД
│   ├── 📊 models/                  # Sequelize модели
│   │   ├── user.js                 # Модель пользователя
│   │   ├── server.js               # Модель сервера
│   │   ├── channel.js              # Модель канала
│   │   └── message.js              # Модель сообщения
│   ├── 🎤 modules/                 # WebRTC модули
│   │   └── webrtc/                 # WebRTC логика
│   ├── 🛣️ routes/                  # API маршруты
│   │   ├── auth.js                 # Аутентификация
│   │   ├── server.js               # Серверы
│   │   ├── channel.js              # Каналы
│   │   └── message.js              # Сообщения
│   └── 🔧 utils/                   # Утилиты
│       └── swagger/                # Swagger документация
│
├── 🎨 frontend/                    # Клиентская часть
│   ├── 📦 package.json             # Зависимости фронтенда
│   ├── 🔧 tsconfig.json            # TypeScript конфигурация
│   ├── 🌐 public/                  # Статические файлы
│   └── 📁 src/                     # Исходный код
│       ├── 🎯 index.tsx            # Точка входа React
│       ├── 🧩 components/          # Переиспользуемые компоненты
│       │   ├── 🎨 ThemeToggle/     # Переключатель темы
│       │   ├── 🔄 spinner/         # Компонент загрузки
│       │   └── 🔔 toastNotifications/ # Уведомления
│       ├── 📄 pages/               # Страницы приложения
│       │   ├── 🔐 auth/            # Страница аутентификации
│       │   ├── 🏠 main/            # Главная страница
│       │   ├── 💬 channelPage/     # Страница каналов
│       │   ├── ⚙️ settings/        # Настройки
│       │   └── 🏰 serverSettings/  # Настройки сервера
│       ├── 📊 store/               # MobX сторы
│       │   ├── authStore.ts        # Аутентификация
│       │   ├── serverStore.ts      # Серверы
│       │   ├── channelsStore.ts    # Каналы
│       │   └── messageStore.ts     # Сообщения
│       ├── 🔧 services/            # API сервисы
│       ├── 🎨 styles/              # Глобальные стили
│       │   ├── _colors.scss        # Цветовая палитра
│       │   ├── _sizes.scss         # Системы размеров
│       │   └── main.scss           # Основные стили
│       ├── 🌍 constants/           # Константы и переводы
│       │   └── i18n/               # Интернационализация
│       ├── 🔧 utils/               # Утилиты
│       │   ├── WebRTCClient.ts     # WebRTC клиент
│       │   ├── SocketClient.ts     # Socket.io клиент
│       │   └── apiClient.ts        # HTTP клиент
│       └── 📝 types/               # TypeScript типы
│
└── 📚 docs/                        # Документация
    ├── api.md                      # API документация
    ├── backend.md                  # Документация бэкенда
    └── frontend.md                 # Документация фронтенда
```

---

## 🔧 API Endpoints

### 🔐 Аутентификация
```
POST   /api/auth/register          # Регистрация пользователя
POST   /api/auth/login             # Вход в систему
POST   /api/auth/logout            # Выход из системы
GET    /api/auth/me                # Информация о текущем пользователе
```

### 🏰 Серверы
```
GET    /api/servers                # Список серверов пользователя
POST   /api/servers                # Создание нового сервера
GET    /api/servers/:id            # Информация о сервере
PUT    /api/servers/:id            # Обновление сервера
DELETE /api/servers/:id            # Удаление сервера
```

### 💬 Каналы
```
GET    /api/servers/:serverId/channels           # Каналы сервера
POST   /api/servers/:serverId/channels           # Создание канала
PUT    /api/servers/:serverId/channels/:id       # Обновление канала
DELETE /api/servers/:serverId/channels/:id       # Удаление канала
```

### 📝 Сообщения
```
GET    /api/servers/:serverId/channels/:channelId/messages    # Сообщения канала
POST   /api/servers/:serverId/channels/:channelId/messages    # Отправка сообщения
DELETE /api/messages/:id                                      # Удаление сообщения
```

### 🔗 Приглашения
```
POST   /api/invites                # Создание приглашения
GET    /api/invites/:token         # Информация о приглашении
POST   /api/invites/:token/accept  # Принятие приглашения
```

### 👥 Участники серверов
```
GET    /api/servers/:serverId/members             # Участники сервера
POST   /api/servers/:serverId/members             # Добавление участника
PUT    /api/servers/:serverId/members/:userId     # Изменение роли
DELETE /api/servers/:serverId/members/:userId     # Удаление участника
```

---

## 💻 Разработка

### Полезные команды

```bash
# 🔧 Установка зависимостей
npm run install:all                # Все зависимости
npm run install:backend            # Только бэкенд
npm run install:frontend           # Только фронтенд

# 🚀 Запуск приложения
npm run start:all                  # Полный стек
npm run start:backend              # Только бэкенд
npm run start:frontend             # Только фронтенд

# 🗄️ Работа с БД
cd backend
npm run db:migrate                 # Применить миграции
npm run db:migrate:undo            # Откатить миграцию
npm run db:seed                    # Заполнить тестовыми данными

# 🔍 Качество кода
npm run lint                       # Проверка линтером
npm run lint:fix                   # Автоисправление
npm run format                     # Форматирование кода

# 📖 Документация
npm run docs-gen                   # Генерация API документации
```

### Настройка среды разработки

1. **VSCode Extensions** (рекомендуемые):
   ```
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Prettier - Code formatter
   - ESLint
   - SCSS IntelliSense
   - Auto Rename Tag
   ```

2. **Chrome Extensions** (для отладки):
   ```
   - React Developer Tools
   - MobX Developer Tools
   - Redux DevTools (если используется)
   ```

### Соглашения о коде

- **Стиль кода**: Prettier + ESLint
- **Коммиты**: Conventional Commits
- **Ветки**: feature/*, bugfix/*, hotfix/*
- **TypeScript**: Строгая типизация
- **CSS**: SCSS с BEM методологией

---

## 🚀 Деплой

### Docker (рекомендуется)

1. **Создайте `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: projectvoice
      MYSQL_USER: projectvoice_user
      MYSQL_PASSWORD: secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: projectvoice_user
      DB_PASSWORD: secure_password
      DB_NAME: projectvoice
      JWT_SECRET: your_production_jwt_secret

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

2. **Запуск:**
```bash
docker-compose up -d
```

### Vercel + PlanetScale (альтернатива)

1. **Фронтенд на Vercel:**
   ```bash
npm install -g vercel
cd frontend
vercel deploy --prod
```

2. **Бэкенд на Railway/Heroku:**
```bash
# Добавьте в package.json бэкенда:
"scripts": {
  "start": "node index.js",
  "build": "npm run db:migrate"
}
```

---

## 🤝 Участие в разработке

Мы приветствуем вклад в проект! Вот как можно помочь:

### 🐛 Сообщение об ошибках
1. Проверьте [Issues](https://github.com/yourusername/projectVoice/issues)
2. Создайте подробный отчет об ошибке
3. Приложите скриншоты и логи

### ✨ Предложение функций
1. Создайте Issue с тегом `enhancement`
2. Опишите предлагаемую функцию
3. Обоснуйте необходимость

### 🔧 Внесение изменений
1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/amazing-feature`
3. Внесите изменения и добавьте тесты
4. Убедитесь, что код проходит линтинг: `npm run lint`
5. Зафиксируйте: `git commit -m 'feat: add amazing feature'`
6. Отправьте: `git push origin feature/amazing-feature`
7. Создайте Pull Request

### 📝 Стиль коммитов
```
feat: новая функция
fix: исправление ошибки  
docs: обновление документации
style: форматирование кода
refactor: рефакторинг
test: добавление тестов
chore: обновление зависимостей
```

---

## 🐛 Решение проблем

### Частые проблемы

**🚫 Порт уже занят:**
```bash
# Найти и завершить процесс
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

**🗄️ Проблемы с БД:**
```bash
# Проверка соединения
mysql -u test_projectvoice -p test_projectvoice

# Перезапуск MySQL
sudo systemctl restart mysql    # Linux
brew services restart mysql    # macOS
```

**📦 Проблемы с зависимостями:**
```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

- 📧 **Email**: project.voice@example.com
- 💬 **Telegram**: [@projectvoice](https://t.me/+55GQeX7tfF5mYmFi)
- 💬 **VK**: [@projectvoice](https://vk.com/freeprojectvoice)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Danik-Off/projectVoice/issues)
- 📖 **Документация**: [Docs](./docs/)

---

## 📄 Лицензия

Этот проект лицензирован под **MIT License**.

### Что это означает?
- ✅ Коммерческое использование
- ✅ Модификация кода
- ✅ Распространение
- ✅ Частное использование
- ❗ Требуется указание авторства

Подробности в файле [LICENSE](LICENSE).

---

## 🎯 Roadmap

### Ближайшие планы (v1.0)
- [ ] Личные звонки
- [ ] 📹 Видеозвонки
- [ ] 📱 Мобильное приложение  
- [ ] 🔒 E2E шифрование
- [ ] 🤖 Боты и интеграции
- [ ] 📊 Аналитика использования
- [ ] 📊 Админ панель

<div align="center">

**ProjectVoice** - Создано с ❤️ для современного общения

[⭐ Поставьте звезду](https://github.com/yourusername/projectVoice) • [🐛 Сообщить об ошибке](https://github.com/yourusername/projectVoice/issues) • [💡 Предложить идею](https://github.com/yourusername/projectVoice/issues)

</div>
