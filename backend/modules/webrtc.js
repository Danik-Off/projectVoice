const rooms = {}; // { roomId: [{ token: string, micToggle: boolean, socketId: string }] }

module.exports = (io) => {
    const getUserByToken = (token) => {
        for (const roomId in rooms) {
            if (rooms.hasOwnProperty(roomId)) {
                for (const socketId in rooms[roomId]) {
                    if (rooms[roomId].hasOwnProperty(socketId)) {
                        const user = rooms[roomId][socketId];
                        if (user.token === token) {
                            return { roomId, socketId, ...user }; // Возвращаем объект пользователя с roomId и socketId
                        }
                    }
                }
            }
        }
        return null; // Если пользователь не найден
    };
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

    io.on('connection', (socket) => {
        console.log('Пользователь подключен: ', socket.id);

        // Пользователь запрашивает создание или присоединение к комнате
        socket.on('join-room', (roomId, token) => {
            console.log(`Пользователь ${socket.id} пытается присоединиться к комнате ${roomId}`);

            if (!rooms[roomId]) {
                rooms[roomId] = [];
                console.log(`Создана новая комната: ${roomId}`);
            }

            // Добавляем пользователя в комнату с начальным состоянием micToggle и socketId
            rooms[roomId].push({ token, micToggle: true, socketId: socket.id });
            socket.join(roomId);
            console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);

            // Отправляем только подключившемуся пользователю список участников комнаты
            const participants = rooms[roomId].map((user) => ({
                token: user.token,
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
            console.log(rooms[roomId]);

            // Обработка выхода пользователя из комнаты
            socket.on('disconnect', () => {
                console.log(`Пользователь ${token} отключился от комнаты ${roomId}`);
                try {
                    rooms[roomId] = rooms[roomId].filter((user) => user.socketId !== socket.id);
                } catch (error) {
                    console.error('Ошибка при удалении пользователя из комнаты:', error);
                }
                console.log(rooms[roomId]);

                socket.to(roomId).emit('user-disconnected', socket.id);
                console.log(
                    `Уведомление отправлено остальным пользователям в комнате ${roomId} о том, что ${socket.id} отключился`
                );

                // Удаляем комнату, если она пуста
                if (rooms[roomId] && rooms[roomId].length === 0) {
                    delete rooms[roomId];
                    console.log(`Комната ${roomId} удалена, так как она пуста.`);
                }
            });
        });

        // Обработка сигналов WebRTC
        socket.on('signal', (data) => {
            const { to, type, ...payload } = data;

            if (to) {
                io.to(to).emit('signal', { from: socket.id, type, ...payload });
                console.log(`Сигнал от ${socket.id} отправлен пользователю с socketId ${to}`);
                console.log(data);
            } else {
                console.log(`Пользователь  ${to} не найден в комнатах`);
            }
        });
        
        // Функция для получения пользователя и обновления состояния micToggle
        const toggleMicForUser = (socketId, newMicToggle) => {
            for (const roomId in rooms) {
                if (rooms.hasOwnProperty(roomId)) {
                    const user = rooms[roomId].find((user) => user.socketId === socketId);
                    if (user) {
                        // Обновляем состояние micToggle
                        user.micToggle = newMicToggle;
                        console.log(
                            `Состояние микрофона для пользователя ${socketId} в комнате ${roomId} изменено на ${
                                user.micToggle ? 'включен' : 'выключен'
                            }`
                        );

                        // Уведомляем других пользователей о переключении микрофона
                        socket
                            .to(roomId)
                            .emit('mic-toggled', { token: user.token, micToggle: user.micToggle });
                        return; // Выходим из функции после обновления
                    }
                }
            }
            console.log(`Пользователь с socketId ${socketId} не найден`);
        };
        // Обработка события отключения микрофона
        socket.on('mute', () => {
            toggleMicForUser(socket.id, false); // Устанавливаем micToggle в false
        });

        // Обработка события включения микрофона
        socket.on('unmute', () => {
            toggleMicForUser(socket.id, true); // Устанавливаем micToggle в true
        });
    });
};
