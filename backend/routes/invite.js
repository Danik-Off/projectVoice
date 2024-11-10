const { v4: uuidv4 } = require('uuid');

const Invite = require('../models').Invite;
const Server = require('../models').Server;
const ServerMember = require('../models').ServerMember;

const express = require('express');
const authenticateToken = require('../middleware/auth');
const { isModerator } = require('../middleware/checkRole');

const router = express.Router();

router.post('/:serverId/invite', authenticateToken, isModerator, async (req, res) => {
    const { expiresAt, maxUses } = req.body;
    console.log('🚀 ~ router.post ~ serverId:', req.params.serverId);
    try {
        const server = await Server.findByPk(req.params.serverId);

        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const token = uuidv4();
        const invite = await Invite.create({
            token,
            serverId: req.params.serverId,
            expiresAt,
            maxUses,
        });

        res.status(201).json({ inviteLink: `${req.protocol}://${req.get('host')}/invite/${token}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/invite/:token', authenticateToken, async (req, res) => {
    try {
        const invite = await Invite.findOne({
            where: {
                token: req.params.token,
            },
        });

        if (!invite) {
            return res.status(404).json({ error: 'Invite not found or expired' });
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

module.exports = router;
