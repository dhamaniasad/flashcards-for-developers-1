'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deckprogress', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      deck: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "decks"
          },
          key: "_id"
        }
      },
      author: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "_id"
        }
      },
      __cards: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deckprogress');
  }
};