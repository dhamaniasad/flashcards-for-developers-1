'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cards', {
      _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      deck: { type: Sequelize.INTEGER, references: { model: { tableName: "decks" }, key: "_id" } },
      author: { type: Sequelize.INTEGER, references: { model: { tableName: "users" }, key: "_id" } },
      front: { type: Sequelize.TEXT, allowNull: false },
      back: { type: Sequelize.TEXT },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards');
  }
};
