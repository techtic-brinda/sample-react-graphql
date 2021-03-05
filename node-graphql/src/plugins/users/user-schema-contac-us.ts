import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { gql } from 'graphile-utils';
import { MailerService } from '@nestjs-modules/mailer';
import * as nunjucks from 'nunjucks';

const CONTAC_US_EMAIL = gql`
    input ContacUsUserInput {
        id: Int
        name:String
        email:String!
        phone:String
        messageBody:String
    }
    type CONTACRESPONSE {
        status: String
        messages: String
    }
    type ContacUsUserPayload {
        data: CONTACRESPONSE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UserContacUs {
  constructor(private readonly mailerService: MailerService) { }

  public sendContactUsEmail(to: string, subject: string, content: any) {
    this.mailerService
      .sendMail({
        to,
        subject,
        html: content,
      })
      .then(res => {
        return 1;
      })
      .catch(err => {
        return err;
      });
  }
  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'userContacUsEmail(input: ContacUsUserInput!)',
    fieldType: 'ContacUsUserPayload',
    additionalGraphql: CONTAC_US_EMAIL,
  })
  public async userContacUsEmail(_mutation: any,
                                 args: any,
                                 context: any,
                                 resolveInfo: { graphile: GraphileHelpers<any> },
                                 build: any,
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query('SAVEPOINT graphql_mutation');
    try {
      let dataMessage = {};
      if (!args.input.id) {
        let contactEmail = '<h2>Contact us</h2><p>{{email}} sent a contact us inquiry.</p><p><br></p>';
        const contextEmail = {
          email: args.input.email,
        };
        const { rows: [settings] } = await pgClient.query(
          `SELECT value FROM settings where settings.key = $1`,
          ['email'],
        );
        if (settings) {
          const email = settings.value ? settings.value : 'orphanadmin@yopmail.com';
          contactEmail = nunjucks.renderString(contactEmail, contextEmail);
          await this.sendContactUsEmail(
            email,
            'inquiry email',
            contactEmail,
          );
          try {
            dataMessage = { status: 200, messages: 'Email sent successfully.' };
          } catch (e) {
            dataMessage = { status: 401, messages: e };
          }
        }
      } else {
        const {
          rows: [user],
        } = await pgClient.query(`SELECT * FROM users where users.id = $1;`, [
          args.input.id,
        ]);
        if (user) {
          const { rows: [settings] } = await pgClient.query(
            `SELECT value FROM settings where settings.key = $1`,
            ['email'],
          );
          if (settings) {
            const email = settings.value ? settings.value : 'orphanadmin@yopmail.com';

            const { rows: [mailTemplate] } = await pgClient.query(
              `SELECT * FROM mail_templates where mail_templates.slug = $1`,
              ['contac-us'],
            );
            if (mailTemplate) {
              let emailTemplate = mailTemplate.content;
              const contextData = {
                name: args.input.name,
                email: args.input.email,
                phone: args.input.phone,
                messageBody: args.input.messageBody,
              };
              emailTemplate = nunjucks.renderString(emailTemplate, contextData);
              await this.sendContactUsEmail(
                email,
                mailTemplate.subject,
                emailTemplate,
              );
              try {
                dataMessage = { status: 200, messages: 'Email sent successfully.' };
              } catch (e) {
                dataMessage = { status: 401, messages: e };
              }
            }
          }
          } else {
            dataMessage = { status: 200, messages: 'User not found!' };
          }
        }

      await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
      return {
          data: dataMessage,
          query: build.$$isQuery,
        };
      } catch (e) {
        await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
        throw e;
      }
    }
}
