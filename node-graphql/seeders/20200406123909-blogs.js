'use strict';
const faker = require('faker');
const _ = require('underscore');

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

    await queryInterface.sequelize.query("SET session_replication_role = 'replica'", { raw: true });

    await queryInterface.bulkDelete('blogs', null, { truncat: true });
    await queryInterface.bulkDelete('blog_categories', null, { truncat: true });
    await queryInterface.bulkDelete('blog_blog_category', null, { truncat: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE blogs_id_seq RESTART WITH 1", { raw: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE blog_categories_id_seq RESTART WITH 1", { raw: true });
    await queryInterface.sequelize.query("SET session_replication_role = 'origin'", { raw: true });


    let blog_categories = [
      { name: 'Adventure' },
      { name: 'Art' },
      { name: 'Baby' },
      { name: 'Beauty' },
      { name: 'Business' },
      { name: 'Craft' },
      { name: 'Decorating' },
      { name: 'Design' },
      { name: 'Food' },
      { name: 'Health' },
      { name: 'Education' },
      { name: 'Unassigned category' },
    ]

    blog_categories = await queryInterface.bulkInsert('blog_categories', blog_categories, { returning: true });

    const blogs = [];
    const blog_blog_category = [];
    for (let index = 0; index < 30; index++) {
      const meta_keywords = [];
      for (let j = 0; j < faker.random.number(3); j++) {
        meta_keywords.push(faker.lorem.words(faker.random.number(2)))
      }
     
      blogs.push({
        title: faker.lorem.sentence(2+ faker.random.number(15)),
        content: faker.lorem.paragraphs(5 + faker.random.number(10)),
        meta_title: faker.lorem.sentence(2 + faker.random.number(5)),
        meta_description: faker.lorem.sentence(2 + faker.random.number(10)),
        meta_keywords: meta_keywords.join(', '),
       // featured_image,
      });

      for (let j = 0; j < faker.random.number(3); j++) {
        blog_blog_category.push({
          blog_id: index + 1,
          blog_category_id: faker.random.arrayElement(blog_categories).id
        })
      }
    }

    await queryInterface.bulkInsert('blogs', blogs, {});
    await queryInterface.bulkInsert('blog_blog_category', _.uniq(blog_blog_category, (item)=> item.blog_category_id+"-"+item.blog_id), {});

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
