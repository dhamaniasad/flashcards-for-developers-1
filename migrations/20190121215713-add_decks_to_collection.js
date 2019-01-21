'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
        
    return queryInterface.sequelize.transaction((t) => {

      return Promise.all([

        queryInterface.addColumn('collections',
          '__decks',
          Sequelize.JSON, {
            transaction: t
          }
        )

      ]);

    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {

      return Promise.all([
        queryInterface.removeColumn("collections", "__decks", {
          transaction: t
        })
      ])

    })
  }
};
