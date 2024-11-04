const express = require('express');
const { User, Server } = require('../models');
const authenticateToken = require('../middleware/auth'); // JWT middleware для проверки токена

const router = express.Router();

// Получить список серверов пользователя
router.get('/user-servers', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const servers = await Server.findAll({
            where: { ownerId: userId },
        });

        if (servers.length === 0) {
            return res.status(404).json({ message: 'У пользователя нет серверов.' });
        }

        res.status(200).json(servers);
    } catch (error) {
        console.error('Ошибка при получении серверов пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Получить информацию о сервере по ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const server = await User.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({ error: 'Сервер не найден.' });
        }

        res.status(200).json(server);
    } catch (error) {
        console.error('Ошибка при получении данных сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Создать новый сервер (доступно только аутентифицированным пользователям)
router.post('/', authenticateToken, async (req, res) => {
    const { name, description, icon } = req.body;
    const ownerId = req.user.userId; // Берем ownerId из токена аутентификации

    if (!name || !ownerId) {
        return res.status(400).json({ error: 'Имя сервера и идентификатор владельца обязательны.' });
    }

    try {
        const newServer = await Server.create({ name, ownerId, description, icon });
        res.status(201).json(newServer);
    } catch (error) {
        console.error('Ошибка при создании сервера:', error);
        res.status(400).json({ error: error.message });
    }
});

// Обновить сервер по ID (доступно только владельцу сервера)
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, description, icon } = req.body;

    try {
        const server = await Server.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({ error: 'Сервер не найден.' });
        }

        if (server.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'У вас нет прав для изменения этого сервера.' });
        }

        if (name) server.name = name;
        if (description) server.description = description;
        if (icon) server.icon = icon;

        await server.save();

        res.status(200).json({ message: 'Сервер обновлён.', server });
    } catch (error) {
        console.error('Ошибка при обновлении сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Удалить сервер по ID (доступно только владельцу сервера)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const server = await Server.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({ error: 'Сервер не найден.' });
        }

        if (server.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'У вас нет прав для удаления этого сервера.' });
        }

        await server.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
