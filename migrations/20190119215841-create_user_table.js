'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      github_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar_url: Sequelize.STRING,
      customerId: Sequelize.STRING,
      user_plan: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pro_monthly"
      },
      email_notifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};