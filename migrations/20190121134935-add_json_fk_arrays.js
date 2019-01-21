'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.sequelize.transaction((t) => {

      return Promise.all([

        queryInterface.addColumn('users',
          '__saved_decks',
          Sequelize.JSON, {
            transaction: t
          }
        ),
        queryInterface.addColumn('users',
          '__study_sessions',
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
        queryInterface.removeColumn("users", "__saved_decks", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "__study_sessions", {
          transaction: t
        })
      ])

    })
  }
};
