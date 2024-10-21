const express = require('express');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const webrtc = require('./modules/webrtc'); // Подключение логики WebRTC

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Разрешите доступ с любого источника
        methods: ['GET', 'POST'], // Укажите разрешенные методы
        credentials: true, // Укажите, если нужно передавать куки
    },
});
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

app.use(express.json());

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

// Подключаем логику WebRTC из отдельного модуля
webrtc(io);

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
