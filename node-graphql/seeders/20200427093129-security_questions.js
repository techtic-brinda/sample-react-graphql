'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('security_questions', null, { truncat: true });
   await queryInterface.sequelize.query("ALTER SEQUENCE security_questions_seq RESTART WITH 1", { raw: true })

    const security_questions = [
      {question : 'What was the house number and street name you lived in as a child?' },
      {question : 'What were the last four digits of your childhood telephone number?'},
      {question : 'What are the last five digits of your driving licence number?'},
      {question : 'In what town or city was your first full time job?'}
    ]

    await queryInterface.bulkInsert('security_questions', security_questions, {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('security_questions', null, { truncat: true });
  }
};
