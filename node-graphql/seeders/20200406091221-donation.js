'use strict';
const { QueryTypes } = require('sequelize');
const faker = require('faker');
const _ = require('underscore');

function donationObj() {
  const amount = faker.commerce.price(1, 200);
  const date  = new Date();
  return {
    user_id: null,
    orphan_id: null,
    orphan_need_id: null,
    amount: amount,
    description: faker.lorem.paragraph(),
    transaction_id: faker.random.number(),
    payment_data: null,
    created_at: faker.date.between(new Date(date.getTime() - (60 * 24 * 60 * 60 * 1000)), new Date()),
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

    await queryInterface.bulkDelete('donations', null, { truncat: true });
    await queryInterface.bulkDelete('donations_category', null, { truncat: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE donations_seq RESTART WITH 1", { raw: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE donations_category_seq RESTART WITH 1", { raw: true });

    const angels = await queryInterface.sequelize.query("SELECT * FROM users where exists (SELECT 1 FROM role_user where user_id = users.id and role_id=2)", { type: QueryTypes.SELECT });
    const orphans = await queryInterface.sequelize.query("SELECT * FROM orphans", { type: QueryTypes.SELECT });
    const orphan_needs = await queryInterface.sequelize.query("SELECT * FROM orphan_needs", { type: QueryTypes.SELECT });
    const categories = await queryInterface.sequelize.query("SELECT * FROM categories", { type: QueryTypes.SELECT });
    

    const donations = [];
    const donations_categories = [];
    for (let index = 0; index < orphans.length; index++) {
      const orphan = orphans[index];
      const _orphan_needs = _.filter(orphan_needs, (item) => item.orphan_id == orphan.id);


      if (_orphan_needs.length > 0){
        for (let ni = 0; ni < _orphan_needs.length; ni++) {
          const orphan_need = _orphan_needs[ni];
          const max_entries = faker.random.number(5);
          const max_amount = orphan_need.amount / max_entries;
          for (let i = 0; i < max_entries; i++) {
            const donation = donationObj();
            donation.orphan_need_id = orphan_need.id;
            donation.user_id = faker.random.arrayElement(angels).id;
            donation.orphan_id = orphan.id;
            donation.amount = faker.commerce.price(1, max_amount);
            donations.push(donation);
          }
        }
      }

      if (categories.length > 0){
        for (let j = 0; j < faker.random.number(3); j++) {
          const donation = donationObj();
          donation.user_id = faker.random.arrayElement(angels).id;
          donation.orphan_id = orphan.id;
          donations.push(donation);

          const cat_count = faker.random.number(categories.length);
          const amount = donation.amount / cat_count;
          for (let dci = 0; dci < cat_count; dci++) {
            donations_categories.push({
              donation_id: donations.length,
              category_id: dci + 1,
              amount: amount
            })
          }
        }
      }
    }

  //  console.log(donations_categories);
   

    await queryInterface.bulkInsert('donations', donations, {});
    await queryInterface.bulkInsert('donations_category', donations_categories, {});
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
