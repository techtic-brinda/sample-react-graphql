'use strict';
var faker = require('faker');

function getRandomUser() {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    dob: faker.date.past(50),
    image: faker.image.avatar(),
    status: 'active',
    email_verified_at: faker.date.past(1),
    address: faker.address.streetAddress()
  }
}

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

    let private_users = [];
    let role_users = [];

    let angel = getRandomUser();
    angel.first_name = 'Angel';
    angel.email = 'angeluser_test@gmail.com';
    angel.stripe_id = 'cus_HEZnfjkAc4eBru';
    let angels = await queryInterface.bulkInsert('users', [angel], { returning: true });
    angels.forEach(user => {
      role_users.push({
        user_id: user.id,
        role_id: 2
      })
      private_users.push({
        user_id: user.id,
        password: 'test@123',
      });
    });

    let champion = getRandomUser();
    champion.first_name = 'Champion';
    champion.email = 'championuser_test@gmail.com';

    let champions = await queryInterface.bulkInsert('users', [champion], { returning: true });
    champions.forEach(user => {
      role_users.push({
        user_id: user.id,
        role_id: 3
      })
      private_users.push({
        user_id: user.id,
        password: 'test@123',
      });
    });

    await queryInterface.bulkInsert('role_user', role_users);
    await queryInterface.bulkInsert({ tableName: 'users', schema: 'private' }, private_users);
    for (let index = 0; index < private_users.length; index++) {
      const private_user = private_users[index];
      queryInterface.sequelize.query("UPDATE private.users SET password = crypt('test@123', password_hash) where user_id = " + private_user.user_id, { raw: true });
    }

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

