'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('deckprogress', 'author', 'user');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('deckprogress', 'user', 'author');
  }
};
