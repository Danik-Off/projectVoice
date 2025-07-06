const { User } = require('../models');

// Middleware для проверки роли пользователя
const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            if (!user.isActive) {
                return res.status(403).json({ error: 'Аккаунт заблокирован' });
            }

            if (!requiredRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Недостаточно прав' });
            }

            req.userRole = user.role;
            req.userData = user;
            next();
        } catch (error) {
            console.error('Ошибка проверки роли:', error);
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
