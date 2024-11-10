'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invites', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            serverId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Servers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            maxUses: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            uses: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Invites');
    },
};
