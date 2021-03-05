'use strict';
var faker = require('faker');

function getRandomInstitution() {
  return {
    name: faker.company.companyName(),
    address: faker.address.streetAddress(),
    state: faker.address.state(),
    country: faker.address.country(),
    local_license: faker.random.number(),
    contact_name: faker.name.findName(),
    contact_email: faker.internet.email(),
    contact_phone: faker.phone.phoneNumberFormat(),
    non_profit: faker.random.boolean(),
    adoption: faker.random.boolean(),
    orphan_age: faker.random.number(),
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('institutions', null, { truncat: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE institutions_id_seq RESTART WITH 1", { raw: true })

    const institutions = []
    for (let index = 0; index < 15; index++) {
      const institution = getRandomInstitution();
      institutions.push(institution);
    }
    await queryInterface.bulkInsert('institutions', institutions, {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
