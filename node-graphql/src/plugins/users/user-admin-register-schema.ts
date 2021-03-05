import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
import { ConfigService } from '../../utils/config.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as nunjucks from 'nunjucks';

const CUSTOM_USER = gql`
    input RegisterAdminUserInput {
        data: JSON!,
        type:String!
    }
    type ADMIN_USER_RESPONSE {
        status: String
        messages: String
    }
    type RegisterAdminUserPayload {
        data: ADMIN_USER_RESPONSE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class AdminUserRegister {
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
    fieldName: 'registerAdminUser(input: RegisterAdminUserInput!)',
    fieldType: 'RegisterAdminUserPayload',
    additionalGraphql: CUSTOM_USER
  })
  public async registerAdminUser(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
      const {data, type = 'champion'} = args.input;
      console.log(data, 'data');
      let dataMessage = {};
      const {
        rows: [user],
      } = await pgClient.query(`SELECT * FROM users where users.id = $1;`, [
        args.input.id,
      ]);
      if (user) {
        let emailType = 'email-verification';
        let verifyPage = 'verify';
        let token = this.getToken(25);
        let email = user.email;
        if(args.input.type === 'update'){
          emailType = 'new-email-verification';
          verifyPage = 'verify-new-email';
          token = user.id;
          email = user.updated_email;
        }
        const { rows: [mailTemplate] } = await pgClient.query(
          `SELECT * FROM mail_templates where mail_templates.slug = $1`,
          [emailType],
        );
        if (mailTemplate) {
          let emailTemplate = mailTemplate.content;
          const context = {
            name: user.first_name + ' ' + user.last_name,
            verifyLink: `${ConfigService.get('FORNTEND_URL')}/${verifyPage}/${token}`,
          };
          emailTemplate = nunjucks.renderString(emailTemplate, context);
          await this.alterEmail(
            email,
            mailTemplate.subject,
            emailTemplate,
          );
          try {
            if (args.input.type != 'update'){
              await pgClient.query(`UPDATE private.users SET email_verify_token = $1 where user_id = $2`, [token, user.id]);
            }
            dataMessage = { status: 200, messages: 'Email sent successfully.' };
          } catch (e) {
            dataMessage = { status: 401, messages: e };
          }
        }
      } else {
        dataMessage = { status: 200, messages: 'User not found!' };
      }
      await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
      return {
        data: dataMessage,
        query: build.$$isQuery,
      };
    } catch (e) {
      await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
      throw e;
    }
  }
} 
