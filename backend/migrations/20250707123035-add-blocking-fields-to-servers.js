'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Servers', 'isBlocked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Servers', 'blockReason', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Servers', 'blockedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Servers', 'blockedBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Servers', 'isBlocked');
    await queryInterface.removeColumn('Servers', 'blockReason');
    await queryInterface.removeColumn('Servers', 'blockedAt');
    await queryInterface.removeColumn('Servers', 'blockedBy');
  }
};
