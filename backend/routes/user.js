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
            attributes: ['id', 'username', 'email', 'bio', 'profilePicture'],             
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

// Обновление личной информации
router.put('/', authenticateToken, async (req, res) => {
    try {
        const { username, email, bio, profilePicture } = req.body;
        const userId = req.user.userId;

        // Проверка, существуют ли предоставленные данные
        if (!username && !email && !bio && !profilePicture) {
            return res.status(400).json({ error: 'Необходимо предоставить хотя бы одно поле для обновления.' });
        }

        // Поиск пользователя
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        // Обновление полей
        if (username) user.username = username;
        if (email) user.email = email;
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.json({ message: 'Информация пользователя обновлена.', user });
    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
