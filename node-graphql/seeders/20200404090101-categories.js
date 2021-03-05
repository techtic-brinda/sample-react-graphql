'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    await queryInterface.bulkDelete('categories', null, { truncat: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE categories_seq RESTART WITH 1", { raw: true })

    const categories = [
      {name : 'Room & Board'},
      {name : 'Health & Immunizations'},
      {name : 'Education & School Supplies'},
      {name : 'Events & Celebrations'},
    ]

    await queryInterface.bulkInsert('categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  
  }
};
