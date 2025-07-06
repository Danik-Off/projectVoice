const express = require('express');
const { User, Server, Channel, Message, ServerMember } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin, isModerator } = require('../middleware/checkRole');
const { Op } = require('sequelize');

const router = express.Router();

// Получение статистики системы
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const stats = {
            users: {
                total: await User.count(),
                active: await User.count({ where: { isActive: true } }),
                blocked: await User.count({ where: { isActive: false } }),
                byRole: {
                    admin: await User.count({ where: { role: 'admin' } }),
                    moderator: await User.count({ where: { role: 'moderator' } }),
                    user: await User.count({ where: { role: 'user' } })
                }
            },
            servers: {
                total: await Server.count(),
                withChannels: await Server.count({
                    include: [{
                        model: Channel,
                        required: true
                    }]
                })
            },
            channels: {
                total: await Channel.count(),
                text: await Channel.count({ where: { type: 'text' } }),
                voice: await Channel.count({ where: { type: 'voice' } })
            },
            messages: {
                total: await Message.count(),
                today: await Message.count({
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                })
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение списка пользователей с пагинацией
router.get('/users', authenticateToken, isModerator, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const role = req.query.role || '';
        const status = req.query.status || '';

        const where = {};
        
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role) {
            where.role = role;
        }

        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'blocked') {
            where.isActive = false;
        }

        const users = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit
        });

        res.json({
            users: users.rows,
            total: users.count,
            page,
            totalPages: Math.ceil(users.count / limit)
        });
    } catch (error) {
        console.error('Ошибка получения пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение информации о пользователе
router.get('/users/:id', authenticateToken, isModerator, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: ServerMember,
                    as: 'serverMembers',
                    include: [{
                        model: Server,
                        as: 'server'
                    }]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json(user);
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление пользователя (роль, статус)
router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { role, isActive } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Проверка, что не блокируем самих себя
        if (user.id === req.user.userId && isActive === false) {
            return res.status(400).json({ error: 'Нельзя заблокировать свой аккаунт' });
        }

        if (role) user.role = role;
        if (typeof isActive === 'boolean') user.isActive = isActive;

        await user.save();

        res.json({ message: 'Пользователь обновлен', user: { id: user.id, role: user.role, isActive: user.isActive } });
    } catch (error) {
        console.error('Ошибка обновления пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удаление пользователя
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Проверка, что не удаляем самих себя
        if (user.id === req.user.userId) {
            return res.status(400).json({ error: 'Нельзя удалить свой аккаунт' });
        }

        await user.destroy();

        res.json({ message: 'Пользователь удален' });
    } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение списка серверов
router.get('/servers', authenticateToken, isModerator, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const servers = await Server.findAndCountAll({
            where,
            include: [
                {
                    model: Channel,
                    attributes: ['id', 'name', 'type']
                },
                {
                    model: ServerMember,
                    as: 'members',
                    attributes: ['id', 'role'],
                    include: [{
                        model: User,
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit
        });

        res.json({
            servers: servers.rows,
            total: servers.count,
            page,
            totalPages: Math.ceil(servers.count / limit)
        });
    } catch (error) {
        console.error('Ошибка получения серверов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение информации о сервере
router.get('/servers/:id', authenticateToken, isModerator, async (req, res) => {
    try {
        const server = await Server.findByPk(req.params.id, {
            include: [
                {
                    model: Channel,
                    include: [{
                        model: Message,
                        limit: 10,
                        order: [['createdAt', 'DESC']],
                        include: [{
                            model: User,
                            attributes: ['id', 'username']
                        }]
                    }]
                },
                {
                    model: ServerMember,
                    as: 'members',
                    include: [{
                        model: User,
                        attributes: ['id', 'username', 'email', 'role', 'isActive']
                    }]
                }
            ]
        });

        if (!server) {
            return res.status(404).json({ error: 'Сервер не найден' });
        }

        res.json(server);
    } catch (error) {
        console.error('Ошибка получения сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удаление сервера
router.delete('/servers/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const server = await Server.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({ error: 'Сервер не найден' });
        }

        await server.destroy();

        res.json({ message: 'Сервер удален' });
    } catch (error) {
        console.error('Ошибка удаления сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение логов системы
router.get('/logs', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Здесь можно добавить логику получения логов из файла или базы данных
        const logs = {
            system: 'Логи системы будут здесь',
            errors: 'Логи ошибок будут здесь',
            access: 'Логи доступа будут здесь'
        };

        res.json(logs);
    } catch (error) {
        console.error('Ошибка получения логов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router; 