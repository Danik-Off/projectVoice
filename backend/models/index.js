"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Нормализуем NODE_ENV и безопасно выбираем конфиг
const allConfig = require(__dirname + "/../config/config.js");
const rawEnv = process.env.NODE_ENV || "development";
const normalizedEnv = String(rawEnv).toLowerCase();

const envAliases = {
  prod: "production",
  production: "production",
  dev: "development",
  development: "development",
  test: "test",
};

const resolvedEnv = envAliases[normalizedEnv] || "development";
const config = allConfig[resolvedEnv];
const db = {};

if (!config) {
  console.error(
    `Конфигурация для NODE_ENV="${rawEnv}" не найдена. Доступные окружения: ${Object.keys(
      allConfig
    ).join(", ")}. Используйте одно из них или исправьте переменную окружения.`
  );
  process.exit(1);
}

console.log("выбрана конфигурация:", resolvedEnv);

// Валидация обязательных полей конфига
const requiredFields = ["database", "username", "host", "dialect"];
const missing = requiredFields.filter((k) => !config[k]);
if (missing.length) {
  console.error(
    `Отсутствуют обязательные параметры в конфиге БД (${resolvedEnv}): ${missing.join(", ")}.\n` +
      `Проверьте .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD?, DB_HOST, DB_DIALECT, DB_PORT).`
  );
  process.exit(1);
}

// Обработка ошибок при подключении к базе данных
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate(); // Проверка подключения
    console.log("Соединение с базой данных успешно установлено.");
  } catch (error) {
    console.error("Ошибка при подключении к базе данных:", error);
    process.exit(1); // Завершаем процесс, если не удалось подключиться
  }
}
checkDatabaseConnection();

// Чтение файлов моделей из текущей директории
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Установка связей между моделями, если они определены
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Добавляем экземпляры Sequelize и sequelize в объект db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Экспортируем объект db для использования в других частях приложения
module.exports = db;
