const { User } = require('../models');

// Middleware для проверки роли пользователя
const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            console.log('🔍 Проверка роли для пользователя:', req.user.userId);
            console.log('🔍 Требуемые роли:', requiredRoles);
            
            const user = await User.findByPk(req.user.userId);
            
            if (!user) {
                console.log('❌ Пользователь не найден');
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            console.log('👤 Найден пользователь:', { id: user.id, username: user.username, role: user.role, isActive: user.isActive });

            if (!user.isActive) {
                console.log('❌ Аккаунт заблокирован');
                return res.status(403).json({ error: 'Аккаунт заблокирован' });
            }

            if (!requiredRoles.includes(user.role)) {
                console.log('❌ Недостаточно прав. Роль пользователя:', user.role, 'Требуемые роли:', requiredRoles);
                return res.status(403).json({ error: 'Недостаточно прав' });
            }

            console.log('✅ Роль проверена успешно');
            req.userRole = user.role;
            req.userData = user;
            next();
        } catch (error) {
            console.error('❌ Ошибка проверки роли:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    };
};

// Middleware для проверки модератора
const isModerator = checkRole(['moderator', 'admin']);

// Middleware для проверки администратора
const isAdmin = checkRole(['admin']);

// Middleware для проверки владельца сервера
const isServerOwner = async (req, res, next) => {
    try {
        const { ServerMember, Server } = require('../models');
        
        // Проверяем, является ли пользователь владельцем сервера по роли в ServerMembers
        const member = await ServerMember.findOne({
            where: {
                serverId: req.params.serverId,
                userId: req.user.userId,
                role: 'owner'
            }
        });

        // Проверяем, является ли пользователь владельцем сервера по полю ownerId
        const server = await Server.findByPk(req.params.serverId);
        const isOwnerByField = server && server.ownerId === req.user.userId;

        if (!member && !isOwnerByField) {
            return res.status(403).json({ error: 'Только владелец сервера может выполнить это действие' });
        }

        next();
    } catch (error) {
        console.error('Ошибка проверки владельца сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = {
    checkRole,
    isModerator,
    isAdmin,
    isServerOwner
};
