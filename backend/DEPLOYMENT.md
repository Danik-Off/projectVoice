# Инструкция по развертыванию базы данных и настройке переменных окружения

## Предварительные требования

### 1. Установка MySQL

#### macOS (через Homebrew)
```bash
# Установка Homebrew (если не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка MySQL
brew install mysql

# Запуск MySQL сервиса
brew services start mysql

# Проверка статуса
brew services list | grep mysql
```

#### Ubuntu/Debian
```bash
# Обновление пакетов
sudo apt update

# Установка MySQL
sudo apt install mysql-server

# Запуск MySQL сервиса
sudo systemctl start mysql
sudo systemctl enable mysql

# Проверка статуса
sudo systemctl status mysql
```

#### Windows
1. Скачайте MySQL Installer с официального сайта: https://dev.mysql.com/downloads/installer/
2. Запустите установщик и следуйте инструкциям
3. Запустите MySQL как службу Windows

### 2. Установка Node.js и npm

#### macOS
```bash
# Установка через Homebrew
brew install node

# Проверка версий
node --version
npm --version
```

#### Ubuntu/Debian
```bash
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версий
node --version
npm --version
```

## Настройка базы данных

### 1. Подключение к MySQL

```bash
# Подключение к MySQL как root
mysql -u root -p
```

### 2. Создание базы данных и пользователя

```sql
-- Создание базы данных
CREATE DATABASE test_projectvoice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя
CREATE USER 'test_projectvoice'@'localhost' IDENTIFIED BY 'TZ8TSEWPet5kJnzN';

-- Предоставление прав пользователю
GRANT ALL PRIVILEGES ON test_projectvoice.* TO 'test_projectvoice'@'localhost';

-- Применение изменений
FLUSH PRIVILEGES;

-- Проверка создания пользователя
SELECT User, Host FROM mysql.user WHERE User = 'test_projectvoice';

-- Выход из MySQL
EXIT;
```

### 3. Проверка подключения

```bash
# Подключение с новым пользователем
mysql -u test_projectvoice -p test_projectvoice
```

## Настройка переменных окружения

### 1. Клонирование проекта

```bash
# Клонирование репозитория
git clone <your-repository-url>
cd projectVoice/backend

# Установка зависимостей
npm install
```

### 2. Настройка .env файла

```bash
# Копирование примера файла
cp .env.example .env

# Редактирование файла
nano .env
# или
code .env
```

### 3. Содержимое .env файла

```env
# Database Configuration
DB_USERNAME=test_projectvoice
DB_PASSWORD=TZ8TSEWPet5kJnzN
DB_DATABASE=test_projectvoice
DB_HOST=localhost
DB_DIALECT=mysql

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

## Запуск приложения

### 1. Проверка конфигурации

```bash
# Проверка загрузки переменных окружения
node -e "require('dotenv').config(); console.log('DB_USERNAME:', process.env.DB_USERNAME);"

# Проверка конфигурации базы данных
node -e "require('dotenv').config(); const config = require('./config/config.js'); console.log('Config:', config.development);"
```

### 2. Запуск миграций

```bash
# Запуск миграций базы данных
npm run db:migrate

# Проверка статуса миграций
npm run db:migrate:status
```

### 3. Запуск приложения

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Продакшн режим
npm start
```

## Проверка работоспособности

### 1. Проверка API

```bash
# Проверка доступности сервера
curl http://localhost:5001/api-docs

# Проверка подключения к базе данных
curl http://localhost:5001/api/auth/health
```

### 2. Проверка базы данных

```bash
# Подключение к базе данных
mysql -u test_projectvoice -p test_projectvoice

# Просмотр таблиц
SHOW TABLES;

# Проверка данных
SELECT * FROM Users LIMIT 5;
```

## Устранение неполадок

### 1. Ошибка подключения к базе данных

```bash
# Проверка статуса MySQL
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Ubuntu

# Перезапуск MySQL
brew services restart mysql      # macOS
sudo systemctl restart mysql     # Ubuntu
```

### 2. Ошибка доступа к базе данных

```sql
-- Сброс пароля пользователя
ALTER USER 'test_projectvoice'@'localhost' IDENTIFIED BY 'TZ8TSEWPet5kJnzN';
FLUSH PRIVILEGES;
```

### 3. Ошибка порта

```bash
# Проверка занятых портов
lsof -i :5001

# Изменение порта в .env
echo "PORT=5002" >> .env
```

### 4. Ошибки миграций

```bash
# Откат последней миграции
npm run db:migrate:undo

# Полный сброс базы данных
npm run db:migrate:undo:all
npm run db:migrate
```

## Продакшн настройки

### 1. Безопасность

```env
# Продакшн .env
NODE_ENV=production
JWT_SECRET=very_long_random_secret_key_here
DB_PASSWORD=strong_production_password
```

### 2. Настройка MySQL для продакшна

```sql
-- Создание продакшн пользователя
CREATE USER 'prod_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON test_projectvoice.* TO 'prod_user'@'localhost';
```

### 3. Настройка PM2 (для продакшна)

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения через PM2
pm2 start index.js --name "projectvoice-backend"

# Сохранение конфигурации
pm2 save
pm2 startup
```

## Дополнительные команды

### Полезные команды для разработки

```bash
# Просмотр логов
npm run dev 2>&1 | tee logs/app.log

# Очистка кэша npm
npm cache clean --force

# Обновление зависимостей
npm update

# Проверка безопасности
npm audit
npm audit fix
```

### Команды для базы данных

```bash
# Резервное копирование
mysqldump -u test_projectvoice -p test_projectvoice > backup.sql

# Восстановление из резервной копии
mysql -u test_projectvoice -p test_projectvoice < backup.sql

# Очистка базы данных
mysql -u test_projectvoice -p -e "DROP DATABASE test_projectvoice; CREATE DATABASE test_projectvoice;"
```
