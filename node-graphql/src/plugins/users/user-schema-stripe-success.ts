import {
  SchemaType,
  ExtendSchema,
} from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import { gql } from 'graphile-utils';
import { ConfigService } from '../../utils/config.service';
import { isEmpty, each } from 'lodash';
import * as nunjucks from 'nunjucks';
import { MailerService } from '@nestjs-modules/mailer';
const moment = require('moment');
const format = require('pg-format');
const stripe = require('stripe')(ConfigService.get('STRIPE_KEY'));

const STRIPE_CREATE_PAYMENT = gql`
  input UserStripeSuccessInput {
    sessionId: String!
    orphanId: Int!
    userId: Int!
  }
  type UserStripeSuccessPayload {
    status: Int
    messages: String
  }
`;
@Injectable()
@SchemaType({ typeName: 'User' })
export class UserStripeSuccess {
  constructor(private readonly mailerService: MailerService) { }

  public sendEmail(to: string, subject: string, content: any) {
    this.mailerService
      .sendMail({ to: to, subject: subject, html: content })
      .then(res => {
        return 1;
      })
      .catch(err => {
        console.log(err, 'err email');
        return 0;
      });
  }

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'userStripeComplete(input: UserStripeSuccessInput!)',
    fieldType: 'UserStripeSuccessPayload',
    additionalGraphql: STRIPE_CREATE_PAYMENT,
  })
  public async userStripeComplete(
    _mutation: any,
    args: any,
    context: any,
    resolveInfo: {},
    build: any,
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query('SAVEPOINT graphql_mutation');
    try {
      let donationId = null;
      let status = 401;
      let messages = 'Something went wrong. Please try againg later';
      const orphanId = args.input.orphanId;
      const userId = args.input.userId;

      const response = await stripe.checkout.sessions
        .retrieve(args.input.sessionId)
        .then(async res => res)
        .catch(e => null);

      if (response) {
        const { rows: [donations] } = await pgClient.query(`select count(id) from donations where transaction_id = $1`, [response.id]);
        if (donations.count > 0) {
          status = 401;
          messages = 'Payment information already saved';
        } else {
          const meta = response.metadata;
          if (!isEmpty(meta)) {
            const totalAmount = parseFloat(meta.totalAmount);
            const adminFees = parseFloat(meta.adminFees);
            const mainAmount = (totalAmount - adminFees);
            const { rows } = await pgClient.query(`SELECT id from categories`);
            let donationQuery = '';
            let type = 'requirement';
            if (
              meta.orphan_need_id !== undefined &&
              meta.orphan_need_id != ''
            ) {
              donationQuery = format(
                // tslint:disable-next-line: max-line-length
                'INSERT INTO donations(user_id, orphan_id, orphan_need_id, amount,transaction_id, admin_fees) VALUES (%s,%s,%s,%L,%L,%L) RETURNING *',
                Number(userId),
                Number(orphanId),
                Number(meta.orphan_need_id),
                mainAmount,
                response.id,
                adminFees,
              );
            } else {
              type = 'direct';
              donationQuery = format(
                'INSERT INTO donations(user_id, orphan_id, amount,transaction_id,admin_fees) VALUES (%s,%s,%L,%L,%L) RETURNING *',
                Number(userId),
                Number(orphanId),
                mainAmount,
                response.id,
                adminFees,
              );
            }
            donationId = await pgClient
              .query(donationQuery)
              .then(res => res.rows[0].id)
              .catch(e => null);

            if (donationId) {
              if (type === 'requirement') {
                await pgClient.query(
                  `UPDATE orphan_needs set received_donation_amount =    (received_donation_amount + $1) where id = $2`,
                  [mainAmount, meta.orphan_need_id],
                );
                status = 200;
              }
              if (rows.length > 0 && type === 'direct') {
                
                let donationCat = [];
                each(rows, (row, index) => {
                  if (
                    meta[row.id] !== undefined &&
                    meta[row.id] !== null &&
                    meta[row.id] !== 0
                  ) {
                    const metaAmount = parseFloat(meta[row.id]);
                    const totalAmountData = parseFloat(response.metadata.amount);
                    const totalamountPer = (metaAmount / totalAmountData);
                    const percentage = (totalamountPer * 100).toFixed(2);
                    donationCat[index] = [donationId, row.id, metaAmount, parseFloat(percentage)];

                  }
                });
                if (donationCat.length > 0) {
                  donationCat =  donationCat.filter(e => e.length);
                  const donationCatQuery = format(
                    'INSERT INTO donations_category (donation_id, category_id, amount, percentage) VALUES %L',
                    donationCat,
                  );
                  await pgClient.query(donationCatQuery);
                }
                status = 200;
              }
            }
          }
        }
      }
      //donationId = 954;
      if (status === 401 && donationId) {
        const { rows: [donation] } = await pgClient.query(`select d.user_id, d.orphan_id, d.created_at , d.amount,
            concat(u.first_name,' ',u.last_name) as donor_name, u.email as donar_email, u.address as donar_address,
            concat(o.first_name,' ',o.last_name) as orphan_name,
            (select concat(first_name,' ', last_name) from users where id= co.champion_id) as champion_name,
            (select email from users where id= co.champion_id) as champion_email
            from donations as d
            left join orphans as o on d.orphan_id = o.id
            left join users as u on d.user_id = u.id
            left join champion_orphan as co on d.orphan_id = co.orphan_id
            where d.id =$1`, [donationId]);
        if (donation) {
          const { rows } = await pgClient.query(
            `SELECT * FROM mail_templates where mail_templates.slug IN ($1,$2)`,
            ['donation-receipt', 'donation-received'],
          );
          if (rows.length > 0) {
            let context = {
              donar_name: donation.donor_name,
              champion_name: donation.champion_name,
              orphan_name: donation.orphan_name,
              donar_address: donation.donar_address,
              donation_amount: `$${parseFloat(donation.amount).toFixed(2)}`,
              donation_received_by: donation.orphan_name,
              donation_received_date: moment(donation.created_at).format('MMMM D, YYYY'),
            };
            let email = null;
            rows.map(async (mailTemplate) => {
              if (mailTemplate.slug === 'donation-received') {
                email = donation.champion_email;
              } else {
                email = donation.email;
              }
              let emailTemplate = mailTemplate.content;
              emailTemplate = nunjucks.renderString(emailTemplate, context);
              if (email) {
                await this.sendEmail(
                  email,
                  mailTemplate.subject,
                  emailTemplate,
                );
              }
            });
          }
        }
      }
      messages = status === 200 ? 'Payment information saved successfully' : messages;
      await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
      return {
        status,
        messages,
        query: build.$$isQuery,
      };
    } catch (e) {
      await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
      throw e;
    }
  }
}
