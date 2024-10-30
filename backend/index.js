const express = require('express');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const webrtc = require('./modules/webrtc'); // Подключение логики WebRTC

//Импорт маршрутов
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/server');

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

app.use(express.json());

app.use(
    cors({
        origin: '*', // Разрешите только это происхождение
        methods: ['GET', 'POST'], // Укажите разрешенные методы
        credentials: true, // Укажите, если вам нужно передавать куки
    })
);

app.use((req, res, next) => {
    console.log(`Запрос: ${req.method} ${req.url}`);
    next();
});

// Подключение маршрутов Api
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);

// Настройка раздачи статических файлов фронтенда
app.use(express.static('../frontend/build')); // Укажите путь к директории сборки

// Обработка всех маршрутов для фронтенда
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html')); // Возвращаем главный файл
});

// Подключаем логику WebRTC из отдельного модуля
webrtc(io);

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
