const {
    addUserToRoom,
    removeUserFromRoom,
    getRoomParticipants,
    getUserByToken,
    getUserBySocketId,
} = require('./rooms');

module.exports = (io) => {
    io.on('connection', connected);

    function connected(socket) {
        console.log('Пользователь подключен: ', socket.id);
        //подключение к комнате или создание комнаты если ее сейчас нет
        socket.on('join-room', handleJoinRoomRequest);
        // Обработка сигналов WebRTC
        socket.on('signal', handleSignalRequest);

        //TODO отказаться здесь от токена ?
        function handleJoinRoomRequest(roomId, token) {
            console.log(`Пользователь ${socket.id} пытается присоединиться к комнате ${roomId}`);
            addUserToRoom(roomId, { token, micToggle: true, socketId: socket.id });

            socket.join(roomId);
            console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);

            // Отправляем только подключившемуся пользователю список участников комнаты
            const participants = getRoomParticipants(roomId).map((user) => ({
                micToggle: user.micToggle,
                socketId: user.socketId,
                user: getUserByToken(token),
            }));

            socket.emit('created', { roomId, participants });

            console.log(`Отправлен список участников комнаты ${roomId} для пользователя ${socket.id}`);

            // Сообщаем всем остальным в комнате, что новый пользователь присоединился
            socket.to(roomId).emit('user-connected', { socketId: socket.id });
            console.log(
                `Уведомление отправлено остальным пользователям в комнате ${roomId} о том, что ${socket.id} подключился`
            );
            socket.on('disconnect', handleDisconnect);
            function handleDisconnect() {
                console.log(`Пользователь ${socket.id} отключился `);

                removeUserFromRoom(roomId, socket.id);

                socket.to(roomId).emit('user-disconnected', socket.id);
                console.log(
                    `Уведомление отправлено остальным пользователям в комнате ${roomId} о том, что ${socket.id} отключился`
                );

                // Удаляем комнату, если она пуста
                removeUserFromRoom(roomId, socket.id);
            }
        }

        function handleSignalRequest(data) {
            const { to, type, ...payload } = data;

            if (to) {
                io.to(to).emit('signal', { from: socket.id, type, ...payload });
                console.log(`Сигнал от ${socket.id} отправлен пользователю с socketId ${to}`);
                console.log(data);
            } else {
                console.log(`Пользователь  ${to} не найден в комнатах`);
            }
        }

        // socket.on('mute', () => {
        //     toggleMicForUser(socket.id, false); // Устанавливаем micToggle в false
        // });

        // // Обработка события включения микрофона
        // socket.on('unmute', () => {
        //     toggleMicForUser(socket.id, true); // Устанавливаем micToggle в true
        // });
    }
};
