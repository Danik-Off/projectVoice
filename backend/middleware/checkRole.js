const { ServerMember } = require('../models');

// Функция для проверки роли участника
const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const member = await ServerMember.findOne({
                where: {
                    userId: req.user.userId,
                    serverId: req.params.serverId,
                },
            });

            if (!member) {
                return res.status(403).json({ error: 'You are not a member of this server' });
            }

            const rolesHierarchy = ['member', 'moderator', 'admin', 'owner'];
            const memberRoleIndex = rolesHierarchy.indexOf(member.role);
            const requiredRoleIndex = rolesHierarchy.indexOf(requiredRole);

            if (memberRoleIndex < requiredRoleIndex) {
                return res.status(403).json({ error: 'Access denied' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};

// Экспортируем функции проверки ролей
const isOwner = checkRole('owner');
const isAdmin = checkRole('admin');
const isModerator = checkRole('moderator');
const isMember = checkRole('member');

module.exports = {
    checkRole,
    isOwner,
    isAdmin,
    isModerator,
    isMember,
};
