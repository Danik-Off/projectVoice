'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        attachments: {
            type: DataTypes.JSON,
            allowNull: true, // Поле необязательное
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Имя таблицы, с которой устанавливается связь
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        channelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Channels', // Имя таблицы, с которой устанавливается связь
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Устанавливает текущее время по умолчанию
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Устанавливает текущее время по умолчанию
        },
    });

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        Message.belongsTo(models.Channel, {
            foreignKey: 'channelId',
            as: 'channel',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return Message;
};
