'use strict';
module.exports = (sequelize, DataTypes) => {
    const Server = sequelize.define(
        'Server',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Сделаем имя уникальным, чтобы избежать дубликатов
                validate: {
                    len: [3, 50], // Длина имени сервера
                },
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true, // Можно изменить на false, если поле обязательно
            },
            icon: {
                type: DataTypes.STRING,
                allowNull: true, // Можно изменить на false, если поле обязательно
            },
            isBlocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blockReason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            blockedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            blockedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
        },
        {
            timestamps: true,
        }
    );

    // Определение ассоциаций
    Server.associate = (models) => {
        Server.belongsTo(models.User, {
            foreignKey: 'ownerId',
            as: 'owner',
        });
        Server.belongsTo(models.User, {
            foreignKey: 'blockedBy',
            as: 'blockedByUser',
        });
        Server.hasMany(models.ServerMember, { foreignKey: 'serverId', as: 'members' }); // Сервер может иметь множество участников
        Server.hasMany(models.Channel, { foreignKey: 'serverId', as: 'channels' });
        Server.belongsToMany(models.User, {
            through: models.ServerMember,
            foreignKey: 'serverId',
            otherKey: 'userId',
            as: 'users',
        });
    };

    return Server;
};
