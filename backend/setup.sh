#!/bin/bash

# Скрипт для автоматической настройки окружения
# Использование: ./setup.sh [--no-install] [--no-db-provision] [--run] [--env-auto] [--force-env]

set -euo pipefail

echo "🚀 Начинаем настройку окружения для ProjectVoice..."

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

NO_INSTALL=0
NO_DB_PROVISION=0
RUN_AFTER=0
ENV_AUTO=0
FORCE_ENV=0
for arg in "$@"; do
  case "$arg" in
    --no-install) NO_INSTALL=1 ;;
    --no-db-provision) NO_DB_PROVISION=1 ;;
    --run) RUN_AFTER=1 ;;
    --env-auto) ENV_AUTO=1 ;;
    --force-env) FORCE_ENV=1 ;;
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

# Генераторы секретов
gen_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "$(date +%s%N)"
  fi
}

gen_password() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 18
  else
    node -e "console.log(require('crypto').randomBytes(18).toString('base64').replace(/[^A-Za-z0-9]/g,'' ).slice(0,18))" 2>/dev/null || echo "Pass$(date +%s)"
  fi
}

write_env_file() {
  local DB_USERNAME_V="$1"
  local DB_PASSWORD_V="$2"
  local DB_DATABASE_V="$3"
  local DB_HOST_V="$4"
  local DB_DIALECT_V="$5"
  local DB_PORT_V="$6"
  local PORT_V="$7"
  local NODE_ENV_V="$8"
  local JWT_SECRET_V="$9"
  local JWT_EXPIRES_V="${10}"

  cat > .env << EOF
# Database Configuration
DB_USERNAME=${DB_USERNAME_V}
DB_PASSWORD=${DB_PASSWORD_V}
DB_DATABASE=${DB_DATABASE_V}
DB_HOST=${DB_HOST_V}
DB_DIALECT=${DB_DIALECT_V}
DB_PORT=${DB_PORT_V}

# Server Configuration
PORT=${PORT_V}
NODE_ENV=${NODE_ENV_V}

# JWT Configuration
JWT_SECRET=${JWT_SECRET_V}
JWT_EXPIRES_IN=${JWT_EXPIRES_V}
EOF
}

# Создание/заполнение .env
if [ -f .env ] && [ "$FORCE_ENV" -eq 0 ]; then
  log "✅ Файл .env уже существует (используйте --force-env для перезаписи)"
else
  if [ "$ENV_AUTO" -eq 1 ]; then
    # Автоматический режим (без ввода)
    DB_HOST_DEF="${DB_HOST:-localhost}"
    DB_PORT_DEF="${DB_PORT:-3306}"
    DB_DIALECT_DEF="${DB_DIALECT:-mysql}"
    DB_DATABASE_DEF="${DB_DATABASE:-projectvoice}"
    DB_USERNAME_DEF="${DB_USERNAME:-projectvoice}"
    DB_PASSWORD_DEF="${DB_PASSWORD:-$(gen_password)}"
    PORT_DEF="${PORT:-5001}"
    NODE_ENV_DEF="${NODE_ENV:-development}"
    JWT_SECRET_DEF="${JWT_SECRET:-$(gen_secret)}"
    JWT_EXPIRES_DEF="${JWT_EXPIRES_IN:-24h}"

    write_env_file "$DB_USERNAME_DEF" "$DB_PASSWORD_DEF" "$DB_DATABASE_DEF" "$DB_HOST_DEF" "$DB_DIALECT_DEF" "$DB_PORT_DEF" "$PORT_DEF" "$NODE_ENV_DEF" "$JWT_SECRET_DEF" "$JWT_EXPIRES_DEF"
    log "✅ Файл .env сгенерирован автоматически (--env-auto)"
  else
    # Интерактивный режим
    log "🧩 Заполняю .env (нажмите Enter, чтобы принять значение по умолчанию)"
    read -r -p "DB_HOST [localhost]: " DB_HOST_INP; DB_HOST_INP=${DB_HOST_INP:-localhost}
    read -r -p "DB_PORT [3306]: " DB_PORT_INP; DB_PORT_INP=${DB_PORT_INP:-3306}
    read -r -p "DB_DIALECT [mysql]: " DB_DIALECT_INP; DB_DIALECT_INP=${DB_DIALECT_INP:-mysql}
    read -r -p "DB_DATABASE [projectvoice]: " DB_DATABASE_INP; DB_DATABASE_INP=${DB_DATABASE_INP:-projectvoice}
    read -r -p "DB_USERNAME [projectvoice]: " DB_USERNAME_INP; DB_USERNAME_INP=${DB_USERNAME_INP:-projectvoice}
    read -r -s -p "DB_PASSWORD [генерируется]: " DB_PASSWORD_INP; echo ""
    DB_PASSWORD_INP=${DB_PASSWORD_INP:-$(gen_password)}
    read -r -p "PORT [5001]: " PORT_INP; PORT_INP=${PORT_INP:-5001}
    read -r -p "NODE_ENV [development]: " NODE_ENV_INP; NODE_ENV_INP=${NODE_ENV_INP:-development}
    read -r -s -p "JWT_SECRET [генерируется]: " JWT_SECRET_INP; echo ""
    JWT_SECRET_INP=${JWT_SECRET_INP:-$(gen_secret)}
    read -r -p "JWT_EXPIRES_IN [24h]: " JWT_EXPIRES_INP; JWT_EXPIRES_INP=${JWT_EXPIRES_INP:-24h}

    write_env_file "$DB_USERNAME_INP" "$DB_PASSWORD_INP" "$DB_DATABASE_INP" "$DB_HOST_INP" "$DB_DIALECT_INP" "$DB_PORT_INP" "$PORT_INP" "$NODE_ENV_INP" "$JWT_SECRET_INP" "$JWT_EXPIRES_INP"
    log "✅ Файл .env создан"
  fi
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

# Если .env существует, но ключевые переменные пустые — автозаполнить при --env-auto или --force-env
need_fill=0
[ -z "${DB_DATABASE}" ] && need_fill=1
[ -z "${DB_USERNAME}" ] && need_fill=1

if [ "$need_fill" -eq 1 ]; then
  if [ "$ENV_AUTO" -eq 1 ] || [ "$FORCE_ENV" -eq 1 ]; then
    log "🧪 Обнаружены пустые переменные в .env — автозаполняю..."
    DB_HOST_DEF="${DB_HOST:-localhost}"
    DB_PORT_DEF="${DB_PORT:-3306}"
    DB_DIALECT_DEF="${DB_DIALECT:-mysql}"
    DB_DATABASE_DEF="${DB_DATABASE:-projectvoice}"
    DB_USERNAME_DEF="${DB_USERNAME:-projectvoice}"
    DB_PASSWORD_DEF="${DB_PASSWORD:-$(gen_password)}"
    PORT_DEF="${PORT:-5001}"
    NODE_ENV_DEF="${NODE_ENV:-development}"
    JWT_SECRET_DEF="${JWT_SECRET:-$(gen_secret)}"
    JWT_EXPIRES_DEF="${JWT_EXPIRES_IN:-24h}"

    write_env_file "$DB_USERNAME_DEF" "$DB_PASSWORD_DEF" "$DB_DATABASE_DEF" "$DB_HOST_DEF" "$DB_DIALECT_DEF" "$DB_PORT_DEF" "$PORT_DEF" "$NODE_ENV_DEF" "$JWT_SECRET_DEF" "$JWT_EXPIRES_DEF"
    log "✅ .env обновлён автозначениями"
    # Перечитать .env
    set -a; source ./.env || true; set +a
  else
    log "⚠️  В .env отсутствуют DB_DATABASE/DB_USERNAME. Запустите: bash setup.sh --env-auto --force-env"
  fi
fi

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
