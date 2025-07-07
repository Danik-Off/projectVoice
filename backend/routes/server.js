const express = require('express');
const jwt = require('jsonwebtoken');
const { Server, User, Channel, ServerMember, Message } = require('../models'); // Include ServerMember model
const { authenticateToken } = require('../middleware/auth');
const { where } = require('sequelize');

const router = express.Router();

// Получить все серверы (только незаблокированные)
router.get('/', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Servers']
    try {
        const servers = await Server.findAll({
            where: {
                isBlocked: false // Показываем только незаблокированные серверы
            },
            include: [
                {
                    model: ServerMember,
                    as: 'members',
                    where: { userId: req.user.userId },
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'profilePicture']
                        }
                    ]
                },
                {
                    model: Channel,
                    as: 'channels'
                }
            ],
        });
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый сервер и добавить создателя как владельца
router.post('/', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Servers']
    const { name, description, icon } = req.body;
    try {
        // Создаем новый сервер
        const newServer = await Server.create({ name, ownerId: req.user.userId, description, icon });

        // Добавляем создателя как участника с ролью владельца
        await ServerMember.create({
            userId: req.user.userId,
            serverId: newServer.id,
            role: 'owner',
        });

        res.status(201).json(newServer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить сервер по ID и его каналы
router.get('/:id', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Servers']
    try {
        const server = await Server.findByPk(req.params.id, {
            include: [
                {
                    model: ServerMember,
                    as: 'members',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'profilePicture']
                        }
                    ]
                },
                {
                    model: Channel,
                    as: 'channels'
                },
                {
                    model: User,
                    as: 'blockedByUser',
                    attributes: ['id', 'username']
                }
            ],
        });
        
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        // Если сервер заблокирован, возвращаем информацию о блокировке
        if (server.isBlocked) {
            return res.status(403).json({
                message: 'Server is blocked',
                server: {
                    id: server.id,
                    name: server.name,
                    isBlocked: server.isBlocked,
                    blockReason: server.blockReason,
                    blockedAt: server.blockedAt,
                    blockedBy: server.blockedByUser ? {
                        id: server.blockedByUser.id,
                        username: server.blockedByUser.username
                    } : null
                }
            });
        }

        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Проверка прав владельца сервера или администратора
const checkServerOwnership = async (req, res, next) => {
    // #swagger.tags = ['Servers']
    const server = await Server.findByPk(req.params.id);

    if (!server) {
        return res.status(404).json({ message: 'Server not found' });
    }

    // Проверяем, заблокирован ли сервер
    if (server.isBlocked) {
        return res.status(403).json({ 
            message: 'Server is blocked',
            server: {
                id: server.id,
                name: server.name,
                isBlocked: server.isBlocked,
                blockReason: server.blockReason,
                blockedAt: server.blockedAt
            }
        });
    }

    // Проверяем, является ли пользователь владельцем сервера по полю ownerId
    const isOwnerByField = server.ownerId === req.user.userId;
    
    // Проверяем, является ли пользователь владельцем сервера по роли в ServerMembers
    const member = await ServerMember.findOne({
        where: {
            serverId: req.params.id,
            userId: req.user.userId,
            role: 'owner'
        }
    });
    const isOwnerByRole = !!member;

    // Пользователь может редактировать сервер, если он владелец по любому из критериев или администратор
    if (!isOwnerByField && !isOwnerByRole && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }

    req.server = server;
    next();
};

// Обновить сервер по ID
router.put('/:id', authenticateToken, checkServerOwnership, async (req, res) => {
    // #swagger.tags = ['Servers']
    const { name, description, icon } = req.body;
    try {
        await req.server.update({ name, description, icon });
        res.status(200).json(req.server);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить сервер по ID, включая все связи участников
router.delete('/:id', authenticateToken, checkServerOwnership, async (req, res) => {
    // #swagger.tags = ['Servers']
    try {
        console.log(`Удаление сервера с ID: ${req.params.id}`);
        
        // Получаем все каналы сервера
        const channels = await Channel.findAll({ where: { serverId: req.params.id } });
        const channelIds = channels.map(channel => channel.id);
        console.log(`Найдено каналов для удаления: ${channelIds.length}`);

        // Удаляем все сообщения в каналах сервера
        if (channelIds.length > 0) {
            const deletedMessages = await Message.destroy({ where: { channelId: channelIds } });
            console.log(`Удалено сообщений: ${deletedMessages}`);
        }

        // Удаляем все каналы сервера
        const deletedChannels = await Channel.destroy({ where: { serverId: req.params.id } });
        console.log(`Удалено каналов: ${deletedChannels}`);

        // Удаляем все связи участников сервера
        const deletedMembers = await ServerMember.destroy({ where: { serverId: req.params.id } });
        console.log(`Удалено участников: ${deletedMembers}`);

        // Удаляем сервер
        await req.server.destroy();
        console.log('Сервер успешно удален');

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления сервера:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
