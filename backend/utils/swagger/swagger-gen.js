// swagger-gen.js
const swaggerAutogen = require('swagger-autogen')();
const path = require('path');
require('dotenv').config();

// Путь к файлам, которые будут использоваться для генерации документации
const outputFile = path.join(__dirname, 'swagger-output.json'); // Путь для генерируемого файла
const endpointsFiles = [path.join(__dirname, '../../index.js')]; // Путь к файлам с роутами

// Конфигурация документации
const port = process.env.PORT || 5001;
const host = `localhost:${port}`;
const doc = {
    info: {
        title: 'projectVoice Api', // Название API
        description: 'rest api',
    },
    host, // Хост
    schemes: ['http'], // Схемы (HTTP/HTTPS)
    tags: [
        { name: 'Auth', description: 'API для аутентификации' },
        { name: 'Users', description: 'API для управления пользователями' },
        { name: 'Servers', description: 'API для серверов' },
        { name: 'Channels', description: 'API для каналов на серверах' },
        { name: 'ServerMembers', description: 'API для участников серверов' },
        { name: 'Invites', description: 'API для приглашений на сервер' },
    ],
};

// Генерация документации
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully!');
});
