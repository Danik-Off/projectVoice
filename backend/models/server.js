'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Сделаем имя уникальным, чтобы избежать дубликатов
      validate: {
        len: [3, 50], // Длина имени сервера
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Поле обязательно для связи с пользователем
      references: {
        model: 'Users', // Связь с моделью User
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Можно изменить на false, если поле обязательно
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true, // Можно изменить на false, если поле обязательно
    },
  }, {
    timestamps: true,
  });

  return Server;
};
