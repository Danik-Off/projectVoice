const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    // #swagger.tags = ['Auth']
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Не переданы обязательные параметры' });
        }
        // Проверка существования пользователя
        const existingUser = await User.findOne({ where: { email } });
        console.log('🚀 ~ router.post ~ existingUser:', existingUser);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
        }

        // Создание нового пользователя
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        // Создание JWT токена

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера.', error });
    }
});

// Логин пользователя
router.post('/login', async (req, res) => {
    // #swagger.tags = ['Auth']
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден.' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Неверный пароль.' });
        }

        // Создание JWT токена
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
