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

**ProjectVoice** - Современное решение для голосового и текстового общения! 🎤💬 