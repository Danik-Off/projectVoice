// rooms.js
const rooms = {}; // { roomId: [{ token: string, micToggle: boolean, socketId: string, userData: object }] }
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

// Получить данные пользователя из токена
const getUserDataFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId, {
            attributes: ['id', 'username', 'profilePicture', 'role']
        });
        return user;
    } catch (error) {
        console.error('Ошибка получения данных пользователя из токена:', error);
        return null;
    }
};

// Добавить пользователя в комнату
const addUserToRoom = async (roomId, user) => {
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Проверка на дублирование пользователя в комнате
    const existingUser = rooms[roomId].find((u) => u.socketId === user.socketId);
    if (!existingUser) {
        // Получаем данные пользователя из базы данных
        const userData = await getUserDataFromToken(user.token);
        const userWithData = {
            ...user,
            userData: userData || { username: 'Unknown User' }
        };
        rooms[roomId].push(userWithData);
    }
};

// Удалить пользователя из комнаты
const removeUserFromRoom = (roomId, socketId) => {
    if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((user) => user.socketId !== socketId);
        // Если комната становится пустой, удалить её
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        }
    }
};

// Получить участников комнаты
const getRoomParticipants = (roomId) => {
    return rooms[roomId] || [];
};

// Получить пользователя по токену
const getUserByToken = async (token) => {
    for (const roomId in rooms) {
        if (rooms.hasOwnProperty(roomId)) {
            const participant = rooms[roomId].find((user) => user.token === token);
            if (participant) {
                return { roomId, ...participant };
            }
        }
    }
    return null;
};

// Получить пользователя по socketId
const getUserBySocketId = (socketId) => {
    for (const roomId in rooms) {
        if (rooms.hasOwnProperty(roomId)) {
            const user = rooms[roomId].find((user) => user.socketId === socketId);
            if (user) {
                return { roomId, ...user };
            }
        }
    }
    return null;
};

module.exports = {
    addUserToRoom,
    removeUserFromRoom,
    getRoomParticipants,
    getUserByToken,
    getUserBySocketId,
};
