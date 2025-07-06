const express = require('express');
const { User, Server } = require('../models');
const { authenticateToken } = require('../middleware/auth'); // JWT middleware для проверки токена

const router = express.Router();

// Получить информацию о пользователе по ID
router.get('/', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Получить информацию о пользователе по ID
router.get('/:id', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        res.status(200).json({
            id: user.id,
            name: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Обновить информацию о авторизованом пользователе
router.put('/', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Users']
    const { name, profilePicture, bio } = req.body;
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = name || user.username;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

// Удалить аккаунт
router.delete('/', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Гойзователь не найден' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

module.exports = router;
