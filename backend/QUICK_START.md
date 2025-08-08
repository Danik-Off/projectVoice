# Быстрый старт ProjectVoice Backend

## 🚀 Быстрая настройка (5 минут)

### 1. Установка зависимостей
```bash
# Клонирование проекта (если еще не сделано)
git clone <repository-url>
cd projectVoice/backend

# Установка зависимостей
npm install
```

### 2. Настройка базы данных MySQL

#### Установка MySQL (macOS)
```bash
brew install mysql
brew services start mysql
```

#### Создание базы данных
```bash
# Подключение к MySQL
mysql -u root -p

# В MySQL консоли:
CREATE DATABASE test_projectvoice;
CREATE USER 'test_projectvoice'@'localhost' IDENTIFIED BY 'TZ8TSEWPet5kJnzN';
GRANT ALL PRIVILEGES ON test_projectvoice.* TO 'test_projectvoice'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Настройка переменных окружения
```bash
# Копирование файла конфигурации
cp .env.example .env

# Файл .env уже настроен с правильными значениями
```

### 4. Запуск приложения
```bash
# Запуск миграций
npm run db:migrate

# Запуск в режиме разработки
npm run dev
```

### 5. Проверка
- Сервер запустится на http://localhost:5001
- API документация: http://localhost:5001/api-docs

## 🔧 Автоматическая настройка

Используйте скрипт для автоматической настройки:
```bash
./setup.sh
```

## 📚 Подробная документация

- `DEPLOYMENT.md` - полная инструкция по развертыванию
- `ENV_SETUP.md` - настройка переменных окружения

## 🐛 Устранение проблем

### Ошибка подключения к MySQL
```bash
# Проверка статуса MySQL
brew services list | grep mysql

# Перезапуск MySQL
brew services restart mysql
```

### Ошибка порта
```bash
# Изменение порта в .env
echo "PORT=5002" >> .env
```

### Ошибки миграций
```bash
# Сброс миграций
npm run db:migrate:undo:all
npm run db:migrate
```

## 📋 Переменные окружения

Основные переменные в `.env`:
```env
DB_USERNAME=test_projectvoice
DB_PASSWORD=TZ8TSEWPet5kJnzN
DB_DATABASE=test_projectvoice
DB_HOST=localhost
DB_DIALECT=mysql
PORT=5001
NODE_ENV=development
```
