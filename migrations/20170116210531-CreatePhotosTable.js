'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Photos',

      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },

        name: {
          type: Sequelize.STRING,
          unique: false,
          validate: {
            notEmpty: {msg: "Falta nombre"}
          }
        },

        url: {
          type: Sequelize.STRING,
          unique: true,
          validate: {
            notEmpty: {msg: "Falta url"}
          }
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },

      {
        sync: {
          force:true
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Photos');
  }
};