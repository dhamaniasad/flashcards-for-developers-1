'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('decks',
      'deleted',
      { type: Sequelize.BOOLEAN, defaultValue: false }
    ).catch(err => {
      console.error(err);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('decks',
      'deleted'
    ).catch(err => {
      console.error(err);
    });
  }
};
