'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.transaction((t) => {

      return Promise.all([

        queryInterface.addColumn('decks',
          'createdAt',
          Sequelize.DATE, {
            transaction: t
          }
        ),
        queryInterface.addColumn('decks',
          'updatedAt',
          Sequelize.DATE, {
            transaction: t
          }
        ),
        queryInterface.addColumn('users',
          'createdAt',
          Sequelize.DATE, {
            transaction: t
          }
        ),
        queryInterface.addColumn('users',
          'updatedAt',
          Sequelize.DATE, {
            transaction: t
          }
        )

      ]);

    })
  },
  down: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.transaction((t) => {

      return Promise.all([
        queryInterface.removeColumn("decks", "createdAt", {
          transaction: t
        }),
        queryInterface.removeColumn("decks", "updatedAt", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "createdAt", {
          transaction: t
        }),
        queryInterface.removeColumn("users", "updatedAt", {
          transaction: t
        })
      ])

    })
  }
}