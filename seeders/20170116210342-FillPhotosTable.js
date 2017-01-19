'use strict';

var photos_url = process.env.PHOTOS_URL || "http://localhost:8000"

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Photos',
      [ 
        {
          name: 'Wood',
          url: photos_url + '/photos/photo1.jpg',
          createdAt: new Date(), updatedAt: new Date()
        },

        {
          name: 'Desktop',
          url: photos_url + '/photos/photo2.jpg',
          createdAt: new Date(), updatedAt: new Date()
        },

        {
          name: 'Man',
          url: photos_url + '/photos/photo3.jpg',
          createdAt: new Date(), updatedAt: new Date()
        },

        {
          name: 'Woman',
          url: photos_url + '/photos/photo4.jpg',
          createdAt: new Date(), updatedAt: new Date()
        },

        {
          name: 'People',
          url: photos_url + '/photos/photo5.jpg',
          createdAt: new Date(), updatedAt: new Date()
        }
      ]
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Photos', null, {});
  }
};