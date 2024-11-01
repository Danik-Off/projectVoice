const express = require('express');
const jwt = require('jsonwebtoken');
const { Server, User, Channel, ServerMember } = require('../models'); // Include ServerMember model
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Получить все серверы
router.get('/', authenticateToken, async (req, res) => {
    try {
        const servers = await Server.findAll();
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый сервер и добавить создателя как владельца
router.post('/', authenticateToken, async (req, res) => {
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
    try {
        const server = await Server.findByPk(req.params.id, {
            include: [{ model: Channel, as: 'channels' }], // Включаем каналы
        });
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Проверка прав владельца сервера или администратора
const checkServerOwnership = async (req, res, next) => {
    const server = await Server.findByPk(req.params.id);

    if (!server) {
        return res.status(404).json({ message: 'Server not found' });
    }

    if (server.ownerId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }

    req.server = server;
    next();
};

// Обновить сервер по ID
router.put('/:id', authenticateToken, checkServerOwnership, async (req, res) => {
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
    try {
        // Удалить все связи участников, связанных с сервером
        await ServerMember.destroy({ where: { serverId: req.params.id } });

        // Удалить сервер
        await req.server.destroy();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
