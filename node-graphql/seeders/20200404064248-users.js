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

    await queryInterface.bulkDelete('users', null, {truncat : true});
    await queryInterface.bulkDelete('role_user', null, { truncat: true});
    await queryInterface.bulkDelete({ tableName: 'users', schema: 'private' }, null, {truncat : true});


    await queryInterface.sequelize.query("ALTER SEQUENCE users_id_seq RESTART WITH 1", { raw: true })
    await queryInterface.sequelize.query("ALTER SEQUENCE role_user_id_seq RESTART WITH 1", { raw: true })
    await queryInterface.sequelize.query("ALTER SEQUENCE private.users_id_seq RESTART WITH 1", { raw: true })

    

    let private_users = [];
    let role_users = [];

    let admin = getRandomUser();
    admin.first_name = 'Admin';
    admin.email = 'admin@gmail.com';
    let admins = await queryInterface.bulkInsert('users', [admin], { returning: true });
    admins.forEach(user => {
      role_users.push({
        user_id: user.id,
        role_id: 1
      })
      private_users.push({
        user_id: user.id,
        password: 'test@123',
      });
    });

    
    let angel = getRandomUser();
    angel.first_name = 'Angel';
    angel.email = 'angel@gmail.com';
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
    
    let  champion = getRandomUser();
    champion.first_name = 'Champion';
    champion.email = 'champion@gmail.com';
    
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

    admins = []
    for (let index = 0; index < 10; index++) {
      const user = getRandomUser();
      admins.push(user);
    }
    admins = await queryInterface.bulkInsert('users', admins, { returning: true });
    admins.forEach(user => {
      role_users.push({
        user_id: user.id,
        role_id: 1
      })
      private_users.push({
        user_id: user.id,
        password: 'test@123',
      });
    });


    angels = []
    for (let index = 0; index < 15; index++) {
      const user = getRandomUser();
      angels.push(user);
    }
    angels = await queryInterface.bulkInsert('users', angels, { returning: true });
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

    champions = [];
    for (let index = 0; index < 15; index++) {
      const user = getRandomUser();
      champions.push(user);
    }
    champions = await queryInterface.bulkInsert('users', champions, { returning: true });
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
    await queryInterface.bulkInsert({ tableName: 'users', schema: 'private'}, private_users);
    for (let index = 0; index < private_users.length; index++) {
      const private_user = private_users[index];
      queryInterface.sequelize.query("UPDATE private.users SET password = crypt('test@123', password_hash) where user_id = " + private_user.user_id, { raw : true});
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

