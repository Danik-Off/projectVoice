# ProjectVoice

Современное веб-приложение для голосового и текстового общения с поддержкой серверов и каналов.

> **Примечание:** Для ускорения разработки был использован генеративный ИИ. Если вы заметите ошибки или неточности, пожалуйста, сообщите о них через Issues в репозитории или любым удобным для вас способом.

## 🚀 Особенности

- **Голосовые каналы** - WebRTC для качественного голосового общения
- **Текстовые каналы** - Обмен сообщениями в реальном времени
- **Система серверов** - Создание и управление серверами
- **Аутентификация** - JWT-based аутентификация пользователей
- **Приглашения** - Система приглашений в серверы
- **WebSocket** - Обновления в реальном времени

## 🛠️ Технологии

**Backend:** Node.js, Express, Sequelize, MySQL, Socket.io, WebRTC, JWT
**Frontend:** React 18, TypeScript, MobX, Socket.io-client, SCSS

## 📋 Требования

- Node.js >= 16.x
- MySQL >= 8.0
- npm >= 8.x

## 🚀 Быстрая установка

### 1. Клонирование и установка
```bash
git clone <repository-url>
cd projectVoice
npm run install:all
```

### 2. Настройка базы данных
```bash
# Создание базы данных
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS test_projectvoice;
CREATE USER IF NOT EXISTS 'test_projectvoice'@'localhost' IDENTIFIED BY 'TZ8TSEWPet5kJnzN';
GRANT ALL PRIVILEGES ON test_projectvoice.* TO 'test_projectvoice'@'localhost';
FLUSH PRIVILEGES;
"
```

### 3. Создание .env файла
```bash
# Создайте файл backend/.env:
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_key_here
```

### 4. Запуск миграций и приложения
```bash
# Миграции
cd backend && npm run db:migrate && cd ..

# Запуск
npm run start:all
```

## 🌐 Доступные URL

- **Приложение**: http://localhost:5000
- **API документация**: http://localhost:5000/api-docs

## 📚 Основные API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Серверы
- `GET /api/servers` - Список серверов
- `POST /api/servers` - Создать сервер

### Каналы
- `GET /api/servers/:serverId/channels` - Каналы сервера
- `POST /api/servers/:serverId/channels` - Создать канал

### Сообщения
- `GET /api/servers/:serverId/channels/:channelId/messages` - Сообщения
- `POST /api/servers/:serverId/channels/:channelId/messages` - Отправить

## 🔧 Команды разработки

```bash
# Установка зависимостей
npm run install:all

# Запуск всего проекта
npm run start:all

# Backend отдельно
cd backend && npm run dev

# Frontend отдельно
cd frontend && npm start

# Миграции
cd backend && npm run db:migrate
```

## 🗄️ Структура проекта

```
projectVoice/
├── backend/                 # Node.js + Express сервер
│   ├── config/             # Конфигурация БД
│   ├── middleware/         # Auth, roles middleware
│   ├── migrations/         # Миграции БД
│   ├── models/            # Sequelize модели
│   ├── modules/           # WebRTC модули
│   ├── routes/            # API маршруты
│   └── utils/             # Утилиты
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы
│   │   ├── services/      # API сервисы
│   │   ├── store/         # MobX стейт
│   │   └── utils/         # WebRTC, Socket
└── docs/                  # Документация
```

## 🔐 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Валидация входных данных
- CORS настройки

## 🌐 WebRTC

Поддержка голосового общения:
- Создание голосовых комнат
- Множественные участники
- Автоматическое подключение/отключение
- Индикаторы состояния микрофона

## 🐛 Отладка

```bash
# Проверка портов
sudo netstat -tulpn | grep -E ":(3000|5000)"

# Подключение к БД
mysql -u test_projectvoice -p test_projectvoice

# Логи (если настроены)
tail -f backend/logs/app.log
```

## 📄 Лицензия

MIT License

## 👥 Авторы

- **Ovchinnikov Danila** - Основной разработчик

## 🐛 Сообщить об ошибке

Если вы заметили ошибки, неточности или у вас есть предложения по улучшению:

- Создайте Issue в репозитории проекта
- Напишите на email: project.voice@mail.ru
- Свяжитесь через Telegram: https://t.me/+boTZg4NHYp5iZGMy

Любая обратная связь поможет улучшить проект! 🙏

---

**ProjectVoice** - Современное решение для голосового и текстового общения! 🎤💬 # ProjectVoice - Голосовой чат-сервис

Проект представляет собой голосовой чат-сервис в стиле Discord с возможностью создания серверов, каналов и голосового общения.

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** версии 16 или выше
- **npm** или **yarn**
- **MySQL** версии 8.0 или выше
- **Git**

## 📋 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd projectVoice
```

### 2. Установка зависимостей

```bash
# Установка всех зависимостей (корень, фронтенд и бэкенд)
npm run install:all
```

Или по отдельности:

```bash
# Зависимости корневого проекта
npm install

# Зависимости фронтенда
npm run install:frontend

# Зависимости бэкенда
npm run install:backend
```

### 3. Настройка базы данных

#### MySQL

**Windows:**
```bash
# Установка через XAMPP или MySQL Installer
# Или через Chocolatey:
choco install mysql

# Запуск службы
net start mysql
```

**macOS:**
```bash
# Установка через Homebrew
brew install mysql

# Запуск службы
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
# Установка
sudo apt update
sudo apt install mysql-server

# Запуск службы
sudo systemctl start mysql
sudo systemctl enable mysql
```

**Linux (CentOS/RHEL/Fedora):**
```bash
# Установка
sudo dnf install mysql-server  # Fedora
sudo yum install mysql-server  # CentOS/RHEL

# Запуск службы
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

#### Создание базы данных

```bash
# Подключение к MySQL
mysql -u root -p

# Создание базы данных
CREATE DATABASE database_development;
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON database_development.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Настройка конфигурации

Отредактируйте файл `backend/config/config.json`:

```json
{
    "development": {
        "username": "db_user",
        "password": "your_password",
        "database": "database_development",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
```

### 5. Миграции базы данных

```bash
# Переход в папку бэкенда
cd backend

# Выполнение миграций
npm run db:migrate

# (Опционально) Заполнение тестовыми данными
npm run db:seed
```

## 🏃‍♂️ Запуск проекта

### Разработка

```bash
# Запуск фронтенда и бэкенда одновременно
npm run start:all
```

Или по отдельности:

```bash
# Запуск бэкенда (порт 3001)
npm run start:backend

# Запуск фронтенда (порт 3000)
npm run start:frontend
```

### Продакшн

```bash
# Сборка фронтенда
cd frontend
npm run build

# Запуск бэкенда в продакшн режиме
cd backend
npm start
```

## 🌐 Доступ к приложению

- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:3001
- **Swagger документация**: http://localhost:3001/api-docs

## 📁 Структура проекта

```
projectVoice/
├── backend/                 # Node.js + Express сервер
│   ├── config/             # Конфигурация БД
│   ├── models/             # Sequelize модели
│   ├── routes/             # API маршруты
│   ├── middleware/         # Промежуточное ПО
│   └── modules/            # WebRTC модули
├── frontend/               # React + TypeScript приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── store/          # MobX стейт-менеджмент
│   │   └── services/       # API сервисы
│   └── public/             # Статические файлы
└── docs/                   # Документация
```

## 🛠️ Полезные команды

### Бэкенд

```bash
cd backend

# Разработка с автоперезагрузкой
npm run dev

# Миграции
npm run db:migrate
npm run db:migrate:undo
npm run db:migrate:status

# Линтинг и форматирование
npm run lint
npm run lint:fix
npm run format

# Генерация документации API
npm run docs-gen
```

### Фронтенд

```bash
cd frontend

# Разработка
npm start

# Сборка для продакшна
npm run build

# Тестирование
npm test

# Линтинг
npm run lint
```

## 🔧 Устранение неполадок

### Проблемы с MySQL

**Windows:**
```bash
# Проверка статуса службы
sc query mysql

# Перезапуск службы
net stop mysql
net start mysql
```

**macOS:**
```bash
# Проверка статуса
brew services list | grep mysql

# Перезапуск
brew services restart mysql
```

**Linux:**
```bash
# Проверка статуса
sudo systemctl status mysql

# Перезапуск
sudo systemctl restart mysql
```

### Проблемы с портами

Если порты 3000 или 3001 заняты:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Проблемы с зависимостями

```bash
# Очистка кэша npm
npm cache clean --force

# Удаление node_modules и переустановка
rm -rf node_modules package-lock.json
npm install
```

## 📦 Развертывание на сервере

### Docker (рекомендуется)

Создайте `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: database_development
      MYSQL_USER: db_user
      MYSQL_PASSWORD: db_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - mysql
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: db_user
      DB_PASSWORD: db_password
      DB_NAME: database_development

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

Запуск:
```bash
docker-compose up -d
```

### Ручное развертывание

1. **Подготовка сервера:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm mysql-server nginx
   
   # CentOS/RHEL
   sudo yum install nodejs npm mysql-server nginx
   ```

2. **Настройка Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Настройка PM2:**
   ```bash
   npm install -g pm2
   
   # Запуск бэкенда
   cd backend
   pm2 start index.js --name "projectvoice-backend"
   
   # Автозапуск
   pm2 startup
   pm2 save
   ```

## 📚 Дополнительная документация

- [API документация](./docs/api.md)
- [Backend документация](./docs/backend.md)
- [Frontend документация](./docs/frontend.md)

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под ISC License. 