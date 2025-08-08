const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const webrtc = require('./modules/webrtc/webrtc'); // Подключение логики WebRTC

//Импорт маршрутов
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/server');
const channeRoutes = require('./routes/channel');
const serverMembersRoutes = require('./routes/serverMembers');
const serverInviteRoutes = require('./routes/invite');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/message');

//
const { exec } = require('child_process');

//документация
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger/swagger-output.json');

// Загрузка переменных окружения (из backend/.env)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const WEBSOCKET_PATH = `/socket`;

// Инициализация Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: WEBSOCKET_PATH,
    cors: {
        origin: '*', // Разрешите доступ с любого источника
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Укажите разрешенные методы
        credentials: true, // Укажите, если нужно передавать куки
    },
});

app.use(express.json());

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:3001', '*'], // Разрешаем доступ с фронтенда
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Добавляем OPTIONS и PATCH
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Явно указываем разрешенные заголовки
        credentials: true, // Укажите, если вам нужно передавать куки
        preflightContinue: false,
        optionsSuccessStatus: 204
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
app.use('/api/servers', channeRoutes);
app.use('/api/serverMembers', serverMembersRoutes); // Исправляем путь для serverMembers
app.use('/api/invite', serverInviteRoutes); //создание invite ссылки
app.use('/api/admin', adminRoutes); //админ панель
app.use('/api/messages', messageRoutes);
//документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Настройка раздачи статических файлов фронтенда
app.use(express.static('../frontend/build')); // Укажите путь к директории сборки

// Обработка всех GET маршрутов для фронтенда (только для SPA)
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

