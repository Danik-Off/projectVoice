const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен.' });
        }
        req.user = user;
        next();
    });
};

// Получение информации о пользователе
router.get('/:id?', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id ? req.params.id : req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
