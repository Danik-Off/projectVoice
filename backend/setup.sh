#!/bin/bash

# Скрипт для автоматической настройки окружения
# Использование: ./setup.sh

set -e  # Остановка при ошибке

echo "🚀 Начинаем настройку окружения для ProjectVoice..."

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js и попробуйте снова."
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm и попробуйте снова."
    exit 1
fi

echo "✅ npm найден: $(npm --version)"

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm install

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "🔧 Создаем файл .env..."
    cp .env.example .env
    echo "✅ Файл .env создан из .env.example"
else
    echo "✅ Файл .env уже существует"
fi

# Проверка MySQL
echo "🔍 Проверяем подключение к MySQL..."

# Проверка наличия MySQL клиента
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL клиент не найден. Установите MySQL и попробуйте снова."
    echo "   Для macOS: brew install mysql"
    echo "   Для Ubuntu: sudo apt install mysql-client"
    exit 1
fi

echo "✅ MySQL клиент найден"

# Проверка подключения к MySQL
if mysql -u test_projectvoice -p'TZ8TSEWPet5kJnzN' -e "SELECT 1;" 2>/dev/null; then
    echo "✅ Подключение к MySQL успешно"
else
    echo "⚠️  Не удалось подключиться к MySQL"
    echo "   Убедитесь, что MySQL сервер запущен и пользователь создан"
    echo "   См. инструкции в DEPLOYMENT.md"
fi

# Проверка конфигурации
echo "🔧 Проверяем конфигурацию..."

# Проверка загрузки переменных окружения
if node -e "require('dotenv').config(); console.log('✅ Переменные окружения загружены'); console.log('DB_USERNAME:', process.env.DB_USERNAME);" 2>/dev/null; then
    echo "✅ Переменные окружения загружены корректно"
else
    echo "❌ Ошибка загрузки переменных окружения"
    exit 1
fi

# Проверка конфигурации базы данных
if node -e "require('dotenv').config(); const config = require('./config/config.js'); console.log('✅ Конфигурация БД загружена');" 2>/dev/null; then
    echo "✅ Конфигурация базы данных загружена корректно"
else
    echo "❌ Ошибка загрузки конфигурации базы данных"
    exit 1
fi

echo ""
echo "🎉 Настройка завершена успешно!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Убедитесь, что MySQL сервер запущен"
echo "2. Создайте базу данных и пользователя (см. DEPLOYMENT.md)"
echo "3. Запустите миграции: npm run db:migrate"
echo "4. Запустите приложение: npm run dev"
echo ""
echo "📚 Документация:"
echo "- DEPLOYMENT.md - полная инструкция по развертыванию"
echo "- ENV_SETUP.md - настройка переменных окружения"
echo ""
