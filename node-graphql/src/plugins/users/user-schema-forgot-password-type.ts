import { SchemaType, ExtendSchema } from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { gql } from 'graphile-utils';
import { ConfigService } from '../../utils/config.service';
import { MailerService } from '@nestjs-modules/mailer';

const CUSTOM_TYPES = gql`
  input ForgotPasswordInput {
    email: String!
  }

  type Foo {
    status: String
    messages: String
  }

  type ForgotPasswordPayload {
    data: Foo
    query: Query
  }
`;
@Injectable()
@SchemaType({ typeName: 'User' })
export class UserForgotPassword {
  constructor(private readonly mailerService: MailerService) { }

  public alterEmail(to: string, subject: string, content: any) {
    this.mailerService
      .sendMail({
        to: to,
        subject: subject,
        html: content,
      })
      .then(res => {
        return 1;
      })
      .catch(err => {
        return err;
      });
  }
  public getToken(value) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < value; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'forgotPassword(input: ForgotPasswordInput!)',
    fieldType: 'ForgotPasswordPayload',
    additionalGraphql: CUSTOM_TYPES,
  })
  public async forgotPassword(
    _mutation: any,
    args: any,
    context: any,
    resolveInfo: {
      graphile: GraphileHelpers<any>;
      mailerService: MailerService;
    },
    build: any,
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    // Start a sub-transaction
    await pgClient.query('SAVEPOINT graphql_mutation');
    try {
      let dataMessage = {};
      const {
        rows: [user],
      } = await pgClient.query(`SELECT * FROM users where users.email = $1`, [
        args.input.email,
      ]);

      if (user) {
        const { rows: [mailTemplate] } = await pgClient.query(
          `SELECT * FROM mail_templates where mail_templates.slug = $1`,
          ['forgot-password'],
        );

        if (mailTemplate) {
          let emailTemplate = mailTemplate.content;
          const token = this.getToken(25);
          const context = {
            name: user.first_name,
            link: `${ConfigService.get('FORNTEND_URL')}/reset-password/${token}`,
            expire_time: ` 24 hours`,
          };
          emailTemplate = nunjucks.renderString(emailTemplate, context);
          await this.alterEmail(
            user.email,
            mailTemplate.subject,
            emailTemplate,
          );
          try {
            await pgClient.query(`UPDATE private.users SET forgot_password_token = $1 where user_id = $2`, [token, user.id]);
            dataMessage = { status: 200, messages: 'Password reset link has been sent on your email, Please check your inbox.' };
          } catch (e) {
            dataMessage = { status: 401, messages: e };
          }
        }
      } else {
        dataMessage = { status: 401, messages: 'You are not register with the email. Please try again.' };
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
