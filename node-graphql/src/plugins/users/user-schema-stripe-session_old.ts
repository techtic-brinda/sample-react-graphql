import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { gql } from "graphile-utils";
import { ConfigService } from '../../utils/config.service';

const stripe = require('stripe')(ConfigService.get('STRIPE_KEY'));

const STRIPE_CREATE_PAYMENT = gql`
    type Metadata{
      key: String
      value: String
    }

    input UserStripeSessionInput {
        customer:String!
        amount:Float!
        orphanId:Int!
        meta : JSON
    }
    type GET_SESSION_STRIPE {
        status: Int
        sessionId: String
        messages:String
    }
    type UserStripeSessionPayload {
        data: GET_SESSION_STRIPE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UserStripeSession {
  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'userStripeGetSession(input: UserStripeSessionInput!)',
    fieldType: 'UserStripeSessionPayload',
    additionalGraphql: STRIPE_CREATE_PAYMENT,
  })
  public async userStripeGetSession(_mutation: any,
    args: any,
    context: any,
    resolveInfo: {},
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
      let dataMessage = {};
      const customer = args.input.customer;
      const meta = args.input.meta;
      const orphanId = args.input.orphanId;
      const amount = parseFloat(args.input.amount);
      const totalAmount = parseFloat((amount * 100).toFixed(2));
      
      await stripe.checkout.sessions.create(
        {
          customer: customer,
          success_url: `${ConfigService.get('FORNTEND_URL')}/donation/${orphanId}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ConfigService.get('FORNTEND_URL')}/donation/${orphanId}`,
          payment_method_types: ['card'],
          metadata: meta,
          line_items: [
            {
              amount : totalAmount,
              currency : "USD",
              quantity: 1,
              name: 'Donation',
            },
          ],
        }).then(async (response) => {
          console.log(response, 'response');
            dataMessage = { status: 200, sessionId: response.id , messages: 'success' };
        }).catch(err => {
            console.log(err,' err');
            dataMessage = { status: 401, messages: err.message, sessionId: null };
        });

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
