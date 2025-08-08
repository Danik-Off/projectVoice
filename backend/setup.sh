#!/bin/bash

# Скрипт для автоматической настройки окружения
# Использование: ./setup.sh [--no-install] [--no-db-provision] [--run]

set -euo pipefail

echo "🚀 Начинаем настройку окружения для ProjectVoice..."

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

NO_INSTALL=0
NO_DB_PROVISION=0
RUN_AFTER=0
for arg in "$@"; do
  case "$arg" in
    --no-install) NO_INSTALL=1 ;;
    --no-db-provision) NO_DB_PROVISION=1 ;;
    --run) RUN_AFTER=1 ;;
  esac
done

os="$(uname -s)"

log() { echo -e "$1"; }

# Проверка наличия Node.js и npm
if ! command -v node >/dev/null 2>&1; then
  log "❌ Node.js не установлен. Установите Node.js и запустите скрипт снова."
  exit 1
fi
log "✅ Node.js: $(node --version)"

if ! command -v npm >/dev/null 2>&1; then
  log "❌ npm не найден. Установите npm и запустите скрипт снова."
  exit 1
fi
log "✅ npm: $(npm --version)"

# Установка зависимостей
if [ "$NO_INSTALL" -eq 0 ]; then
  log "📦 Устанавливаем зависимости..."
  npm install
else
  log "⏭️  Пропуск установки зависимостей (--no-install)"
fi

# Создание .env при отсутствии
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    log "🔧 Создаем файл .env из .env.example..."
    cp .env.example .env
  else
    log "📝 .env.example не найден — генерирую базовый .env..."
    cat > .env << 'EOF'
# Database Configuration
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_HOST=localhost
DB_DIALECT=mysql
DB_PORT=3306

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=change_me
JWT_EXPIRES_IN=24h
EOF
  fi
  log "✅ Файл .env создан. Отредактируйте его при необходимости."
else
  log "✅ Файл .env уже существует"
fi

# Загрузка переменных окружения из .env
set -a
source ./.env || true
set +a

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-test_projectvoice}
DB_USERNAME=${DB_USERNAME:-test_projectvoice}
DB_PASSWORD=${DB_PASSWORD:-test_password}
PORT=${PORT:-5001}

log "ℹ️  Конфиг БД: host=$DB_HOST port=$DB_PORT db=$DB_DATABASE user=$DB_USERNAME dialect=${DB_DIALECT:-mysql}"

# MySQL: установка (только macOS при наличии brew)
if ! command -v mysql >/dev/null 2>&1; then
  if [ "$os" = "Darwin" ] && command -v brew >/dev/null 2>&1; then
    log "📥 Устанавливаю MySQL через Homebrew..."
    brew install mysql || true
    log "▶️  Запускаю MySQL как сервис..."
    brew services start mysql || true
  else
    log "⚠️  MySQL клиент не найден. Установите MySQL вручную и запустите скрипт снова."
    log "   macOS: brew install mysql"
    log "   Ubuntu/Debian: sudo apt install mysql-server"
    NO_DB_PROVISION=1
  fi
fi

# Ожидание запуска MySQL (если клиент доступен)
if command -v mysql >/dev/null 2>&1; then
  log "⏳ Ожидаю доступность MySQL..."
  for i in {1..30}; do
    if mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent >/dev/null 2>&1; then
      log "✅ MySQL доступен"
      break
    fi
    sleep 1
    if [ "$i" -eq 30 ]; then
      log "⚠️  Не удалось дождаться доступности MySQL на ${DB_HOST}:${DB_PORT}"
    fi
  done
fi

# Провижининг БД: создание БД и пользователя
if [ "$NO_DB_PROVISION" -eq 0 ] && command -v mysql >/dev/null 2>&1; then
  log "🔧 Настраиваю базу данных..."

  run_sql() {
    local SQL="$1"
    # 1) Пытаемся через root без пароля (часто работает локально)
    if mysql -h"$DB_HOST" -P"$DB_PORT" -uroot -e "$SQL" >/dev/null 2>&1; then
      return 0
    fi
    # 2) Пробуем с паролем из MYSQL_ROOT_PASSWORD, если задан
    if [ -n "${MYSQL_ROOT_PASSWORD:-}" ]; then
      if mysql -h"$DB_HOST" -P"$DB_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD" -e "$SQL" >/dev/null 2>&1; then
        return 0
      fi
    fi
    return 1
  }

  SQL_CREATE_DB="CREATE DATABASE IF NOT EXISTS \`$DB_DATABASE\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  SQL_CREATE_USER="CREATE USER IF NOT EXISTS '$DB_USERNAME'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; CREATE USER IF NOT EXISTS '$DB_USERNAME'@'%' IDENTIFIED BY '$DB_PASSWORD';"
  SQL_GRANT="GRANT ALL PRIVILEGES ON \`$DB_DATABASE\`.* TO '$DB_USERNAME'@'localhost'; GRANT ALL PRIVILEGES ON \`$DB_DATABASE\`.* TO '$DB_USERNAME'@'%'; FLUSH PRIVILEGES;"

  if run_sql "$SQL_CREATE_DB" && run_sql "$SQL_CREATE_USER" && run_sql "$SQL_GRANT"; then
    log "✅ База данных и пользователь готовы"
  else
    log "⚠️  Не удалось автоматически настроить БД."
    log "   Подсказка: задайте MYSQL_ROOT_PASSWORD перед запуском скрипта, например:"
    log "   MYSQL_ROOT_PASSWORD=... ./setup.sh"
  fi
else
  log "⏭️  Пропуск провижининга БД (--no-db-provision или нет mysql)"
fi

# Проверки Node-конфига
log "🔍 Проверяем конфигурацию Node..."
node -e "require('dotenv').config(); const cfg=require('./config/config.js'); console.log('✅ cfg.development OK:', cfg.development && cfg.development.database);" 2>/dev/null || {
  log "❌ Конфигурация Node/Sequelize недоступна"; exit 1; }

# Миграции
log "🗄️  Запускаю миграции..."
npm run db:migrate || true

# Документация
log "📘 Генерирую Swagger..."
npm run docs-gen || true

log "\n🎉 Готово!"
log "- Сервер: http://localhost:${PORT}/"
log "- Swagger: http://localhost:${PORT}/api-docs"

if [ "$RUN_AFTER" -eq 1 ]; then
  log "▶️  Запускаю сервер (npm run dev)..."
  npm run dev
else
  log "👉 Для запуска сервера выполните: npm run dev"
fi
