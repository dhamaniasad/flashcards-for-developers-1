'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cardprogress', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      card: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "cards"
          },
          key: "_id"
        }
      },
      user: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "_id"
        }
      },
      reviewedAt: {
        type: Sequelize.DATE
      },
      leitnerBox: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cardprogress');
  }
};
