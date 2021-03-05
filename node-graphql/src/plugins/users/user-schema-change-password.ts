import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
import { ConfigService } from '../../utils/config.service';
const stripe = require('stripe')(ConfigService.get('STRIPE_KEY'));

const CUSTOM_STRIPE_USER = gql`
    input ProfileChangePasswordInput {
        newPassword: String!
        oldPassword: String!
        userId: Int! 
    }
    type changePasswordResponse {
        data: String
        messages: String
    }
    type ProfileChangePasswordPayload {
        data: changePasswordResponse
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UserProfileChangePassword {
  constructor() { }

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'profileChangePassword(input: ProfileChangePasswordInput!)',
    fieldType: 'ProfileChangePasswordPayload',
    additionalGraphql: CUSTOM_STRIPE_USER,
  })
  public async profileChangePassword(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
      const { newPassword, oldPassword, userId } = args.input;
      let dataMessage = {};
      const {
        rows: [user],
      } = await pgClient.query(`SELECT * FROM users where email = $1;`, [
        args.input.email,
      ]);
      if (user) {
        const email = user.email;
        stripe.customers.create({  email: email })
          .then(customer => {
            pgClient.query(`UPDATE public.users SET stripe_id = $1 where email = $2`, [customer.id, email]);
            dataMessage = { status: 200, messages: 'Stripe customer has been added' };
          }).catch(error => {
            dataMessage = { status: 401, messages: error };
          });
      } else {
        dataMessage = { status: 200, messages: 'User not found!' };
      }
      await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
        return {
            data: dataMessage,
            query: build.$$isQuery,
        };
    } catch(e) {
      await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
      throw e;
    }
}
} 
