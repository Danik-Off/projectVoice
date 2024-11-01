// models/ServerMember.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const ServerMember = sequelize.define(
        'ServerMember',
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            serverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Servers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            role: {
                type: DataTypes.ENUM('member', 'moderator', 'admin', 'owner'), // Четыре роли
                allowNull: false,
                defaultValue: 'member', // Роль по умолчанию
            },
        },
        {
            timestamps: true,
        }
    );
    // models/ServerMember.js
    ServerMember.associate = (models) => {
        ServerMember.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        ServerMember.belongsTo(models.Server, {
            foreignKey: 'serverId',
            as: 'server',
        });
    };

    return ServerMember;
};
