'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('decks', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      status: {
        type: Sequelize.STRING,
        defaultValue: "public",
        allowNull: false,
        validate: {
          isIn: [
            ["public", "private"]
          ]
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Self graded"
      },
      source: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      stars: Sequelize.INTEGER,
      createdTime: Sequelize.DATE,
      difficulty: Sequelize.JSON,
      upvotes: Sequelize.INTEGER,
      downvotes: Sequelize.INTEGER,
      new: Sequelize.BOOLEAN,
      pro: {
        type: Sequelize.BOOLEAN
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('decks');
  }
};