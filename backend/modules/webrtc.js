const rooms = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Пользователь подключен: ', socket.id);

        // Пользователь запрашивает создание или присоединение к комнате
        socket.on('join-room', (roomId, userId) => {
            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }
            rooms[roomId].push(userId);
            socket.join(roomId);
            console.log(`Пользователь ${userId} присоединился к комнате ${roomId}`);

            // Сообщаем всем остальным в комнате, что новый пользователь присоединился
            socket.to(roomId).emit('user-connected', userId);

            // Обработка выхода пользователя из комнаты
            socket.on('disconnect', () => {
                console.log(`Пользователь ${userId} отключился от комнаты ${roomId}`);
                rooms[roomId] = rooms[roomId].filter(id => id !== userId);
                socket.to(roomId).emit('user-disconnected', userId);

                // Удаляем комнату, если она пуста
                if (rooms[roomId].length === 0) {
                    delete rooms[roomId];
                    console.log(`Комната ${roomId} удалена, так как она пуста.`);
                }
            });
        });

        // Обработка сигналов WebRTC
        socket.on('signal', (data) => {
            const { to, from, signal } = data;
            io.to(to).emit('signal', { from, signal });
        });
    });
};
