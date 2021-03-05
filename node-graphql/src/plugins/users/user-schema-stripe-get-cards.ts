import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { gql } from "graphile-utils";
import { ConfigService } from '../../utils/config.service';
import { async } from "rxjs/internal/scheduler/async";
import { map, extend } from 'lodash';
const stripe = require('stripe')(ConfigService.get('STRIPE_KEY'));

const CUSTOM_STRIPE_GET_CARD = gql`
    input UserStripeGetCardInput {
        stripe_id:String!
    }
    type Card {
      id:String
      brand: String
      object: String
      customer: String
      last4: String
      name: String
      exp_month: Int
      exp_year: Int
      default_source:String
    }
    type GET_CARD_STRIPE {
        status: Int
        data: [Card]
        messages:String
    }
    type UserStripeGetCardPayload {
        data: GET_CARD_STRIPE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UserStripeGetCard {
  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'userStripeGetCard(input: UserStripeGetCardInput!)',
    fieldType: 'UserStripeGetCardPayload',
    additionalGraphql: CUSTOM_STRIPE_GET_CARD,
  })
  public async userStripeGetcard(_mutation: any,
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
      await stripe.customers.listSources(
        args.input.stripe_id,
        {
          object: 'card',
        }).then(async (response) => {
          let default_source = null;
          let response_data = [];
          if (response.data.length > 0) {
            await stripe.customers.retrieve(
              args.input.stripe_id).then(customer => {
                if (customer) {
                  for (let i = 0; i < response.data.length; i++) {
                    response.data[i]['default_source'] = customer.default_source;
                    response_data.push(response.data[i]);
                  }
                }
              });
          }
          dataMessage = { status: 200, data: response_data, messages: 'success' };
        }).catch(err => {
          dataMessage = { status: 401, messages: err.message, data: null };
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
