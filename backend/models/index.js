'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

console.log("выбрана конфигурация:",env);

// Обработка ошибок при подключении к базе данных
try {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
    console.log('Соединение с базой данных успешно установлено.');
} catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
    process.exit(1); // Завершить процесс, если не удалось подключиться к базе данных
}

// Чтение файлов моделей из текущей директории
fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
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
