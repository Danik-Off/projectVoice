const { User, Server, Channel, Message, ServerMember } = require('./models');

async function testAdminMethods() {
    try {
        console.log('🧪 Начинаем тестирование админских методов...\n');

        // Тест 1: Проверка подключения к базе данных
        console.log('1️⃣ Тестируем подключение к базе данных...');
        const initialUserCount = await User.count();
        console.log('✅ Количество пользователей:', initialUserCount);

        // Тест 2: Проверка моделей
        console.log('\n2️⃣ Проверяем доступность моделей...');
        console.log('User model:', typeof User);
        console.log('Server model:', typeof Server);
        console.log('Channel model:', typeof Channel);
        console.log('Message model:', typeof Message);
        console.log('ServerMember model:', typeof ServerMember);

        // Тест 3: Проверка статистики пользователей
        console.log('\n3️⃣ Тестируем статистику пользователей...');
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { isActive: true } });
        const blockedUsers = await User.count({ where: { isActive: false } });
        
        console.log('Всего пользователей:', totalUsers);
        console.log('Активных пользователей:', activeUsers);
        console.log('Заблокированных пользователей:', blockedUsers);

        // Тест 4: Проверка статистики по ролям
        console.log('\n4️⃣ Тестируем статистику по ролям...');
        const adminCount = await User.count({ where: { role: 'admin' } });
        const moderatorCount = await User.count({ where: { role: 'moderator' } });
        const regularUserCount = await User.count({ where: { role: 'user' } });
        
        console.log('Админов:', adminCount);
        console.log('Модераторов:', moderatorCount);
        console.log('Пользователей:', regularUserCount);

        // Тест 5: Проверка статистики серверов
        console.log('\n5️⃣ Тестируем статистику серверов...');
        const totalServers = await Server.count();
        const activeServers = await Server.count({ where: { isBlocked: false } });
        const blockedServers = await Server.count({ where: { isBlocked: true } });
        
        console.log('Всего серверов:', totalServers);
        console.log('Активных серверов:', activeServers);
        console.log('Заблокированных серверов:', blockedServers);

        // Тест 6: Проверка статистики каналов
        console.log('\n6️⃣ Тестируем статистику каналов...');
        const totalChannels = await Channel.count();
        const textChannels = await Channel.count({ where: { type: 'text' } });
        const voiceChannels = await Channel.count({ where: { type: 'voice' } });
        
        console.log('Всего каналов:', totalChannels);
        console.log('Текстовых каналов:', textChannels);
        console.log('Голосовых каналов:', voiceChannels);

        // Тест 7: Проверка статистики сообщений
        console.log('\n7️⃣ Тестируем статистику сообщений...');
        const totalMessages = await Message.count();
        console.log('Всего сообщений:', totalMessages);

        // Тест 8: Проверка серверов с каналами
        console.log('\n8️⃣ Тестируем серверы с каналами...');
        const serversWithChannels = await Server.count({
            include: [{
                model: Channel,
                as: 'channels',
                required: true
            }]
        });
        console.log('Серверов с каналами:', serversWithChannels);

        console.log('\n✅ Все тесты прошли успешно!');

    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Запускаем тесты
testAdminMethods(); 