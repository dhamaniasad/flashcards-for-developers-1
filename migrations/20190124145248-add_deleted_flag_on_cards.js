'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards',
      'deleted',
      { type: Sequelize.BOOLEAN, defaultValue: false }
    ).catch(err => {
      console.error(err);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cards',
      'deleted'
    ).catch(err => {
      console.error(err);
    });
  }
};
