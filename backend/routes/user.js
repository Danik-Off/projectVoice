const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticateToken = require('../middleware/auth'); 

const router = express.Router();


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
