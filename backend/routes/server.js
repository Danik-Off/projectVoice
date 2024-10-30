const express = require('express');
const { Server } = require('../models'); // Импортируем модель Server
const router = express.Router();

// Получить все серверы
router.get('/', async (req, res) => {
    try {
        const servers = await Server.findAll();
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый сервер
router.post('/', async (req, res) => {
    const { name, ownerId, description, icon } = req.body;
    try {
        const newServer = await Server.create({ name, ownerId, description, icon });
        res.status(201).json(newServer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить сервер по ID
router.get('/:id', async (req, res) => {
    try {
        const server = await Server.findByPk(req.params.id);
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить сервер по ID
router.put('/:id', async (req, res) => {
    const { name, ownerId, description, icon } = req.body;
    try {
        const [updated] = await Server.update(
            { name, ownerId, description, icon },
            { where: { id: req.params.id } }
        );
        if (updated) {
            const updatedServer = await Server.findByPk(req.params.id);
            return res.status(200).json(updatedServer);
        }
        throw new Error('Server not found');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить сервер по ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Server.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Server not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
