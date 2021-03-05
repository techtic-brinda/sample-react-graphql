'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   await queryInterface.bulkDelete('mail_templates', null, { truncat: true });
   await queryInterface.sequelize.query("ALTER SEQUENCE orphan_healths_id_seq RESTART WITH 1", { raw: true })

    const mail_templates = [
      {title : 'Forgot Password' , subject :'Forgot Password', content : '<h2>Dear {{name}},</h2><p>You are receiving this email because we received a password reset request for your account.</p><p><a href="{{ link }}" target="_blank">Reset Password</a></p><p>This password reset link will expire in {{ expire_time }}.</p><p>If you did not request a password reset, no further action is required.</p><p>&nbsp;</p><p>Regards,</p><p>Orphan Angels Team</p>'},
      {title : 'Welcome email', subject : 'Welcome email', content:'<h2>Dear {{name}},</h2> <p>Welsome to orphan angles.</p><p>User Name : {{ user }} .</p><p>&nbsp;</p><p>Regards,</p><p>Orphan Angels Team</p>'},
      {title : 'Email verification', subject : 'Email verification', content:'<h2>Dear {{name}},</h2><p>Wowwee! Thanks for registering an account with Orphan Angels!&nbsp;</p><p>Before we get started, we&#39;ll need to verify your email.</p><table align="center" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td style="vertical-align:middle"><a href="{{verifyLink}}" target="_blank">Verify Email</a></td></tr></tbody></table><p>&nbsp;</p><p>Regards,</p><p>Orphan Angels Team</p>'},
      {title : 'Donation receipt', subject : 'Donation receipt', content:'<p>&nbsp;</p><h2><strong>Donation&nbsp;Receipt</strong></h2><p>February&nbsp;20,&nbsp;1957</p><p>&nbsp;</p><p>Thank&nbsp;you&nbsp;for&nbsp;your&nbsp;gift!&nbsp;</p><p>The&nbsp;amount&nbsp;you&nbsp;have&nbsp;given&nbsp;will&nbsp;make&nbsp;a&nbsp;difference&nbsp;as&nbsp;the&nbsp;proceeds&nbsp;will&nbsp;go&nbsp;help&nbsp;put&nbsp;the orphan children&nbsp;<br />to give&nbsp;them&nbsp;better&nbsp;education, helth and food make&nbsp;them&nbsp;better.&nbsp;</p><p>This&nbsp;receipt&nbsp;is&nbsp;an&nbsp;attestation&nbsp;that&nbsp;we&nbsp;have&nbsp;gratefully&nbsp;received&nbsp;your&nbsp;generous&nbsp;contribution&nbsp;to&nbsp;our&nbsp;orphan angels institution.&nbsp;</p><p>&nbsp;</p><p><strong>Donor&#39;s&nbsp;Name</strong></p><p>{{donar_name}}</p><p><strong>Donor&#39;s&nbsp;Address</strong></p><p>{{donar_address}}</p><p><strong>Donation&nbsp;Amount</strong></p><p>{{donation_amount}}</p><p><strong>Donation&nbsp;received&nbsp;by</strong></p><p>{{donation_received_by}}</p><p><strong>Date&nbsp;Received</strong></p><p>{{donation_received_date}}</p><p>&nbsp;</p><p>Regards,</p><p>Orphan Angels Team</p><p>&nbsp;</p>'},
      {title : 'New email verification', subject : 'New email verification', content:'<p>Hi , {{name}}</p><p>To completed email verification, Please press the below button.</p><p>&nbsp;</p><table align="center" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td style="vertical-align:middle"><a href="{{verifyLink}}" target="_blank">Verify Email</a></td></tr></tbody></table><p>Regards,</p><p>Orphan Angels Team</p>'},
      {title : 'Contac us', subject : 'Contac us', content:'<p>Hello,</p><p><strong>From :</strong> {{name}}<br /><strong>Email&nbsp;:</strong> {{email}}<br /><strong>Phone No :</strong> {{phone}}<br /><br /><strong>Message Body :</strong>&nbsp;</p> <p>{{messageBody}}</p>'}
    ]
    await queryInterface.bulkInsert('mail_templates', mail_templates, {});
  },
  down: async(queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
