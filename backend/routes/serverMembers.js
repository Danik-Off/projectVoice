const express = require('express');
const { ServerMember, User, Server } = require('../models');
const authenticateToken = require('../middleware/auth');
const { isAdmin, isOwner, isModerator } = require('../middleware/checkRole'); // Импортируйте необходимые проверки ролей

const router = express.Router();

// Получить всех участников сервера
router.get('/:serverId/members', authenticateToken, async (req, res) => {
    try {
        const membersData = await ServerMember.findAll({
            where: { serverId: req.params.serverId },
            attributes: ['userId', 'serverId', 'role'], // выберите только нужные поля из ServerMember
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'profilePicture'], // выберите только нужные поля из User
                },
            ],
            raw: true, // возвращает чистый результат
        });

        const members = membersData.map((member) => ({
            userId: member.userId,
            username: member['user.username'],
            serverId: member.serverId,
            role: member.role,
            profilePicture: member['user.profilePicture'],
        }));

        res.status(200).json(members);
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            res.status(400).json({ error: 'Database error occurred' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Добавить нового участника в сервер
router.post('/:serverId/members', authenticateToken, isModerator, async (req, res) => {
    const { userId, role } = req.body;

    try {
        const server = await Server.findByPk(req.params.serverId);
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        if (userId === server.ownerId) {
            return res.status(400).json({ error: 'User is already the owner of the server' });
        }

        // Проверка на существование участника
        const existingMember = await ServerMember.findOne({
            where: { userId, serverId: req.params.serverId },
        });

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member of the server' });
        }

        const newMemberRole = role || 'member';

        if (!['member', 'moderator', 'admin'].includes(newMemberRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const newMember = await ServerMember.create({
            userId,
            serverId: req.params.serverId,
            role: newMemberRole,
        });

        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Обновить информацию об участнике сервера
router.put('/:serverId/members/:memberId', authenticateToken, isAdmin, async (req, res) => {
    const { role } = req.body;

    try {
        const member = await ServerMember.findByPk(req.params.memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (!['member', 'moderator', 'admin', 'owner'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        if (role === 'owner' && member.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Only the current owner can assign a new owner' });
        }

        await member.update({ role });
        res.status(200).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить участника из сервера
router.delete('/:serverId/members/:memberId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const member = await ServerMember.findByPk(req.params.memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await member.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Установить нового владельца сервера
router.post('/:serverId/owner', authenticateToken, isOwner, async (req, res) => {
    try {
        const server = await Server.findByPk(req.params.serverId);
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        if (server.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'Only the owner can add an owner' });
        }

        server.ownerId = req.body.userId;
        await server.save();

        await ServerMember.create({
            userId: req.body.userId,
            serverId: req.params.serverId,
            role: 'owner',
        });

        res.status(200).json({ message: 'New owner added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
