'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn( 'Photos',
                                      'AuthorId',
                                      {type: Sequelize.INTEGER }
                                      );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Photos', 'AuthorId');
  }
};
