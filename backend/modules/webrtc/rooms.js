// rooms.js
const rooms = {}; // { roomId: [{ token: string, micToggle: boolean, socketId: string }] }

// Добавить пользователя в комнату
const addUserToRoom = (roomId, user) => {
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Проверка на дублирование пользователя в комнате
    const existingUser = rooms[roomId].find((u) => u.socketId === user.socketId);
    if (!existingUser) {
        rooms[roomId].push(user);
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
const getUserByToken = (token) => {
    for (const roomId in rooms) {
        if (rooms.hasOwnProperty(roomId)) {
            const user = rooms[roomId].find((user) => user.token === token);
            if (user) {
                return { roomId, ...user }; // Возвращаем объект пользователя с roomId
            }
        }
    }
    return null; // Если пользователь не найден
};

// Получить пользователя по socketId
const getUserBySocketId = (socketId) => {
    for (const roomId in rooms) {
        if (rooms.hasOwnProperty(roomId)) {
            const user = rooms[roomId].find((user) => user.socketId === socketId);
            if (user) {
                return { roomId, ...user }; // Возвращаем объект пользователя с roomId
            }
        }
    }
    return null; // Если пользователь не найден
};

module.exports = {
    addUserToRoom,
    removeUserFromRoom,
    getRoomParticipants,
    getUserByToken,
    getUserBySocketId,
};
