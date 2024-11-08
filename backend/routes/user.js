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

// Получить информацию о пользователе по ID
router.get('/', authenticateToken, async (req, res) => {
    console.log(req, res);
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Получить информацию о пользователе по ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        res.status(200).json(server);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Обновить информацию о авторизованом пользователе
router.put('/', authenticateToken, async (req, res) => {
    //
});

// Удалить аккаунт
router.delete('/', authenticateToken, async (req, res) => {});

module.exports = router;
