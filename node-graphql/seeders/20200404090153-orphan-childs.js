'use strict';
const { QueryTypes } = require('sequelize');
var faker = require('faker');

function getRandomChild() {
  let country = faker.address.country();
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    middel_name: faker.name.firstName(),
    date_of_birth: faker.date.past(19),
    place_of_birth: faker.address.city(),
    country_of_birth: country,
    nationality: country,
    no_years_in_institution: faker.random.number(1),
    comments: faker.lorem.paragraph(),
    image: faker.image.avatar(),
    status: 'active'
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    const institutions = await queryInterface.sequelize.query("SELECT * FROM institutions", { type: QueryTypes.SELECT });
    const champions = await queryInterface.sequelize.query("SELECT * FROM users where exists (SELECT 1 FROM role_user where user_id = users.id and role_id=3)", { type: QueryTypes.SELECT });


    await queryInterface.bulkDelete('orphans', null, { truncat: true });
    await queryInterface.bulkDelete('orphan_educations', null, { truncat: true });
    await queryInterface.bulkDelete('orphan_healths', null, { truncat: true });
    await queryInterface.bulkDelete('orphan_needs', null, { truncat: true });
    await queryInterface.sequelize.query("ALTER SEQUENCE orphans_id_seq RESTART WITH 1", { raw: true })
    await queryInterface.sequelize.query("ALTER SEQUENCE orphan_educations_id_seq RESTART WITH 1", { raw: true })
    await queryInterface.sequelize.query("ALTER SEQUENCE orphan_healths_id_seq RESTART WITH 1", { raw: true })
    await queryInterface.sequelize.query("ALTER SEQUENCE orphan_needs_seq RESTART WITH 1", { raw: true })

    const vaccines =  [
      "Diphtheria",
      "Hepatitis B",
      "Haemophilus influenzae type b",
      "Human papillomavirus",
      "Seasonal influenza",
      "Measles",
      "Mumps",
      "Pertussis",
      "Rubella",
      "Pneumococcal disease",
      "Poliomyelitis(Polio)",
      "Rotavirus",
      "Tuberculosis(TB)",
      "Tetanus",
      "Varicella",
    ];
    const disabilities = [
      "Blindness",
      "Low Vision",
      "Leprosoy Cured persons",
      "Locomotor Disability",
      "Dwarfism",
      "Intellectual Disability",
      "Mental Illness",
      "Cerebral Palsy",
      "Specific Learning Disabilities",
      "Speech and Language disability",
      "Hearing Impairment(Deaf and Hard of Hearing)",
      "Muscular Dystrophy",
      "Acid Attack Victim",
      "Parkinson’s disease",
      "Multiple Sclerosis",
    ];

    const childs = []
    for (let index = 0; index < 200; index++) {
      const child = getRandomChild();
      child.institution_id = faker.random.arrayElement(institutions).id
      if (faker.random.boolean()){
        child.user_id = faker.random.arrayElement(champions).id
      }
      childs.push(child);
    }

    const data = await queryInterface.bulkInsert('orphans', childs, { returning: true });
    let educations = [];
    let helths = [];
    let needs = [];
    data.forEach(child => {
      for (let index = 0; index < faker.random.number(5); index++) {
        const education = {
          orphan_id: child.id,
          grade: faker.random.arrayElement(['A','B','C','D']),
          comment : faker.lorem.paragraph()
        }
        educations.push(education)
      }

      for (let index = 0; index < faker.random.number(3); index++) {
        const helth = {
          orphan_id: child.id,
          vaccinations: faker.random.arrayElement(vaccines),
          last_doctor: faker.name.findName(),
          medical_exam: faker.lorem.paragraph(),
          disabilities: faker.random.arrayElement(disabilities),
          comments: faker.lorem.paragraph()
        }
        helths.push(helth)
      }

      for (let index = 0; index < faker.random.number(3); index++) {
        const date = new Date();
        const amount = faker.commerce.price();
        const need = {
          orphan_id: child.id,
          title: faker.commerce.product(),
          amount: amount,
          received_donation_amount: faker.commerce.price(0, amount),
          description: faker.lorem.paragraph(),
          close_date: faker.date.between(new Date(date.getTime() - (5 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000))),
        }
        needs.push(need)
      }


    });

    await queryInterface.bulkInsert('orphan_educations', educations, {});
    await queryInterface.bulkInsert('orphan_healths', helths, {});
    await queryInterface.bulkInsert('orphan_needs', needs, {});

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
