const express = require('express');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/auth');
const cors = require('cors');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
app.use(express.json());

// Инициализация Sequelize для PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Проверка подключения к базе данных
sequelize
    .authenticate()
    .then(() => console.log('Успешное подключение к базе данных'))
    .catch((error) => console.error('Ошибка подключения к базе данных:', error));

app.use(
    cors({
        origin: 'http://localhost:3000', // Разрешите только это происхождение
        methods: ['GET', 'POST'], // Укажите разрешенные методы
        credentials: true, // Укажите, если вам нужно передавать куки
    })
);

app.use((req, res, next) => {
    console.log(`Запрос: ${req.method} ${req.url}`);
    next();
});
// Подключение маршрутов
app.use('/api/auth', authRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
