const express = require('express');
const { Channel } = require('../models'); // Импортируем модель Channel
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { isModerator } = require('../middleware/checkRole'); // Импортируйте необходимые проверки ролей

// Получить все каналы по serverId
router.get('/:serverId/channels', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Channels']
    const { serverId } = req.params; // Получаем serverId из параметров
    try {
        const channels = await Channel.findAll({ where: { serverId } });
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый канал в указанном сервере
router.post('/:serverId/channels', authenticateToken, isModerator, async (req, res) => {
    // #swagger.tags = ['Channels']
    const { name, type } = req.body; // serverId теперь в URL
    const { serverId } = req.params; // Получаем serverId из параметров
    try {
        const newChannel = await Channel.create({ name, type, serverId });
        res.status(201).json(newChannel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить канал по ID в рамках конкретного сервера
router.get('/:serverId/channels/:channelId', async (req, res) => {
    // #swagger.tags = ['Channels']
    const { channelId } = req.params; // Получаем channelId из параметров
    try {
        const channel = await Channel.findByPk(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить канал по ID в рамках конкретного сервера
router.put('/:serverId/channels/:channelId', authenticateToken, isModerator, async (req, res) => {
    // #swagger.tags = ['Channels']
    const { name, type } = req.body; // serverId теперь в URL
    const { channelId } = req.params; // Получаем channelId из параметров
    try {
        const [updated] = await Channel.update({ name, type }, { where: { id: channelId } });
        if (updated) {
            const updatedChannel = await Channel.findByPk(channelId);
            return res.status(200).json(updatedChannel);
        }
        throw new Error('Channel not found');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить канал по ID в рамках конкретного сервера
router.delete('/:serverId/channels/:channelId', authenticateToken, isModerator, async (req, res) => {
    // #swagger.tags = ['Channels']
    const { channelId } = req.params; // Получаем channelId из параметров
    try {
        const deleted = await Channel.destroy({
            where: { id: channelId },
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
