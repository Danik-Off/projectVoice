'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invite = sequelize.define('Invite', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        serverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Servers',
                key: 'id',
            },
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true, // можно сделать необязательным, если приглашение будет бессрочным
        },
        maxUses: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true,
        },
        uses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
    
    Invite.associate = (models) => {
        Invite.belongsTo(models.Server, {
            foreignKey: 'serverId',
            as: 'server',
        });
    };

    return Invite;
};
