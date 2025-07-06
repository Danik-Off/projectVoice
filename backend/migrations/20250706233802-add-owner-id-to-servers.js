'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Сначала добавляем поле как nullable
    await queryInterface.addColumn('Servers', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Заполняем поле ownerId для существующих серверов
    // Берем первого участника с ролью 'owner' для каждого сервера
    const servers = await queryInterface.sequelize.query(
      'SELECT id FROM Servers WHERE ownerId IS NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const server of servers) {
      const ownerMember = await queryInterface.sequelize.query(
        'SELECT userId FROM ServerMembers WHERE serverId = ? AND role = "owner" LIMIT 1',
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: [server.id]
        }
      );

      if (ownerMember.length > 0) {
        await queryInterface.sequelize.query(
          'UPDATE Servers SET ownerId = ? WHERE id = ?',
          {
            type: Sequelize.QueryTypes.UPDATE,
            replacements: [ownerMember[0].userId, server.id]
          }
        );
      }
    }

    // Теперь делаем поле NOT NULL
    await queryInterface.changeColumn('Servers', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Servers', 'ownerId');
  }
};
