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
        //подключение к комнате или создание комнаты если ее сейчас нет
        socket.on('join-room', handleJoinRoomRequest);
        // Обработка сигналов WebRTC
        socket.on('signal', handleSignalRequest);

        //TODO отказаться здесь от токена ?
        async function handleJoinRoomRequest(roomId, token) {
            await addUserToRoom(roomId, { token, micToggle: true, socketId: socket.id });

            socket.join(roomId);

            // Отправляем только подключившемуся пользователю список участников комнаты
            const participants = getRoomParticipants(roomId).map((user) => ({
                micToggle: user.micToggle,
                socketId: user.socketId,
                userData: user.userData
            }));

            socket.emit('created', { roomId, participants });

            // Сообщаем всем остальным в комнате, что новый пользователь присоединился
            const currentUser = getUserBySocketId(socket.id);
            socket.to(roomId).emit('user-connected', { 
                socketId: socket.id,
                userData: currentUser?.userData || { username: 'Unknown User' }
            });

            socket.on('disconnect', handleDisconnect);
            socket.on('leave-room', handleDisconnect);
            function handleDisconnect() {
                removeUserFromRoom(roomId, socket.id);

                socket.to(roomId).emit('user-disconnected', socket.id);

                // Удаляем комнату, если она пуста
                removeUserFromRoom(roomId, socket.id);
            }
        }

        function handleSignalRequest(data) {
            const { to, type, ...payload } = data;

            if (to) {
                io.to(to).emit('signal', { from: socket.id, type, ...payload });
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
