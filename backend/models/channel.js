'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50], // Укажите минимальную и максимальную длину имени канала
      },
    },
    type: {
      type: DataTypes.ENUM('text', 'voice'),
      allowNull: false,
    },
    serverId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Поле обязательно для связи с сервером
      references: {
        model: 'Servers', // Связь с моделью Server
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: true,
    tableName: 'Channels', // Убедитесь, что имя таблицы соответствует миграции
  });

  // Определение ассоциаций
  Channel.associate = (models) => {
    Channel.belongsTo(models.Server, { foreignKey: 'serverId', as: 'server' });
  };

  return Channel;
};
