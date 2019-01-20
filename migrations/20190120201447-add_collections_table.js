'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('collections', {
      _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      emoji: { type: Sequelize.STRING },
      color: { type: Sequelize.STRING },
      order: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('collections');
  }
};
