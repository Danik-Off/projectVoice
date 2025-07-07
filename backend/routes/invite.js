const { v4: uuidv4 } = require('uuid');

const Invite = require('../models').Invite;
const Server = require('../models').Server;
const ServerMember = require('../models').ServerMember;

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { isModerator } = require('../middleware/checkRole');

const router = express.Router();

// Создать приглашение на сервер
router.post('/:serverId/invite', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Invites']
    const { expiresAt, maxUses } = req.body;
    
    try {
        const server = await Server.findByPk(req.params.serverId);

        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Проверяем права пользователя на сервере
        const member = await ServerMember.findOne({
            where: { 
                userId: req.user.userId, 
                serverId: req.params.serverId 
            }
        });

        if (!member || !['owner', 'admin', 'moderator'].includes(member.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to create invites' });
        }

        const token = uuidv4();
        const invite = await Invite.create({
            token,
            serverId: req.params.serverId,
            createdBy: req.user.userId,
            expiresAt,
            maxUses,
            uses: 0
        });

        res.status(201).json({ 
            invite: {
                id: invite.id,
                token: invite.token,
                serverId: invite.serverId,
                createdBy: invite.createdBy,
                maxUses: invite.maxUses,
                uses: invite.uses,
                expiresAt: invite.expiresAt,
                createdAt: invite.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Принять приглашение (публичный роут)
router.get('/invite/:token', async (req, res) => {
    // #swagger.tags = ['Invites']
    try {
        const invite = await Invite.findOne({
            where: {
                token: req.params.token,
            },
        });

        if (!invite) {
            return res.status(404).json({ error: 'Invite not found or expired' });
        }

        // Проверка срока действия
        if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
            return res.status(400).json({ error: 'Invite has expired' });
        }

        // Проверка использования и ограничений
        if (invite.maxUses && invite.uses >= invite.maxUses) {
            return res.status(400).json({ error: 'Invite has reached its maximum uses' });
        }

        // Получаем информацию о сервере
        const server = await Server.findByPk(invite.serverId);
        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Возвращаем информацию о приглашении и сервере
        res.status(200).json({ 
            invite: {
                id: invite.id,
                token: invite.token,
                serverId: invite.serverId,
                maxUses: invite.maxUses,
                uses: invite.uses,
                expiresAt: invite.expiresAt
            },
            server: {
                id: server.id,
                name: server.name,
                description: server.description,
                icon: server.icon
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Принять приглашение (для аутентифицированных пользователей)
router.post('/invite/:token/accept', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Invites']
    try {
        const invite = await Invite.findOne({
            where: {
                token: req.params.token,
            },
        });

        if (!invite) {
            return res.status(404).json({ error: 'Invite not found or expired' });
        }

        // Проверка срока действия
        if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
            return res.status(400).json({ error: 'Invite has expired' });
        }

        // Проверка использования и ограничений
        if (invite.maxUses && invite.uses >= invite.maxUses) {
            return res.status(400).json({ error: 'Invite has reached its maximum uses' });
        }

        // Проверка, что пользователь не является участником сервера
        const existingMember = await ServerMember.findOne({
            where: { userId: req.user.userId, serverId: invite.serverId },
        });

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member of the server' });
        }

        // Добавление пользователя на сервер
        await ServerMember.create({
            userId: req.user.userId,
            serverId: invite.serverId,
            role: 'member',
        });

        // Увеличение счетчика использования
        invite.uses += 1;
        await invite.save();

        res.status(200).json({ message: 'User added to server' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все приглашения сервера
router.get('/:serverId/invites', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Invites']
    try {
        const member = await ServerMember.findOne({
            where: { 
                userId: req.user.userId, 
                serverId: req.params.serverId 
            }
        });

        if (!member || !['owner', 'admin', 'moderator'].includes(member.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to view invites' });
        }

        const invites = await Invite.findAll({
            where: { serverId: req.params.serverId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(invites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить приглашение
router.delete('/:inviteId', authenticateToken, async (req, res) => {
    // #swagger.tags = ['Invites']
    try {
        const invite = await Invite.findByPk(req.params.inviteId);
        
        if (!invite) {
            return res.status(404).json({ error: 'Invite not found' });
        }

        const member = await ServerMember.findOne({
            where: { 
                userId: req.user.userId, 
                serverId: invite.serverId 
            }
        });

        if (!member || !['owner', 'admin'].includes(member.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to delete invites' });
        }

        await invite.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
