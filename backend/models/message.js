'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'Message',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'Messages',
            timestamps: true,
        }
    );

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: 'senderId',
            as: 'sender',
        });
        Message.belongsTo(models.User, {
            foreignKey: 'receiverId',
            as: 'receiver',
        });
    };

    return Message;
};
