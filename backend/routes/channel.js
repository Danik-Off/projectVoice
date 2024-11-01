const express = require('express');
const { Channel } = require('../models'); // Импортируем модель Channel
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {  isModerator } = require('../middleware/checkRole'); // Импортируйте необходимые проверки ролейа

// Получить все каналы
router.get('/', authenticateToken, async (req, res) => {
    try {
        const channels = await Channel.findAll();
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый канал
router.post('/', authenticateToken, isModerator, async (req, res) => {
    const { name, type, serverId } = req.body;
    try {
        const newChannel = await Channel.create({ name, type, serverId });
        res.status(201).json(newChannel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить канал по ID
router.get('/:id', async (req, res) => {
    try {
        const channel = await Channel.findByPk(req.params.id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить канал по ID
router.put('/:id', authenticateToken, isModerator, async (req, res) => {
    const { name, type, serverId } = req.body;
    try {
        const [updated] = await Channel.update({ name, type, serverId }, { where: { id: req.params.id } });
        if (updated) {
            const updatedChannel = await Channel.findByPk(req.params.id);
            return res.status(200).json(updatedChannel);
        }
        throw new Error('Channel not found');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить канал по ID
router.delete('/:id', authenticateToken, isModerator, async (req, res) => {
    try {
        const deleted = await Channel.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Channel not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
