# Настройка переменных окружения

## Обзор

Конфигурация базы данных и других настроек приложения теперь вынесена в переменные окружения для повышения безопасности и гибкости.

## Файлы конфигурации

- `.env` - файл с переменными окружения (не коммитится в git)
- `.env.example` - пример файла с переменными окружения
- `config/config.js` - конфигурация базы данных, использующая переменные окружения

## Настройка

1. Скопируйте файл `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте файл `.env` и укажите ваши значения:

   ```env
   # Database Configuration
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database_name
   DB_HOST=localhost
   DB_DIALECT=mysql

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=24h
   ```

## Переменные окружения

### База данных
- `DB_USERNAME` - имя пользователя базы данных
- `DB_PASSWORD` - пароль пользователя базы данных
- `DB_DATABASE` - название базы данных
- `DB_HOST` - хост базы данных (обычно localhost)
- `DB_DIALECT` - тип базы данных (mysql, postgres, sqlite)

### Сервер
- `PORT` - порт, на котором будет запущен сервер
- `NODE_ENV` - окружение (development, test, production)

### JWT (JSON Web Tokens)
- `JWT_SECRET` - секретный ключ для подписи JWT токенов
- `JWT_EXPIRES_IN` - время жизни JWT токенов

## Безопасность

- Файл `.env` добавлен в `.gitignore` и не будет коммититься в репозиторий
- Никогда не коммитьте реальные значения переменных окружения
- Используйте разные значения для разных окружений (development, staging, production)

## Проверка конфигурации

Для проверки, что переменные окружения загружаются правильно:

```bash
node -e "require('dotenv').config(); console.log('DB_USERNAME:', process.env.DB_USERNAME);"
```
