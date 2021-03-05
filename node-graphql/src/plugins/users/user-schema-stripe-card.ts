import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
import { ConfigService } from '../../utils/config.service';
const stripe = require('stripe')(ConfigService.get('STRIPE_KEY'));

const CUSTOM_STRIPE_ADD_CARD = gql`
    input UserStripeCardInput {
        stripe_id:String!
        card_number:String
        name:String
        exp_month:String
        exp_year:String
        cvc:String
        type:String
        cardId:String
    }
    type STRIPEADDCARDRESPONSE {
        status: Int
        messages: String
    }
    type UserStripeCardPayload {
        data: STRIPEADDCARDRESPONSE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UserStripeCard {
  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'userStripeCard(input: UserStripeCardInput)',
    fieldType: 'UserStripeCardPayload',
    additionalGraphql: CUSTOM_STRIPE_ADD_CARD,
  })
  public async userStripecard(_mutation: any,
    args: any,
    context: any,
    resolveInfo: {},
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    const type = args.input.type;
    const stripeId = args.input.stripe_id;
    let dataMessage = {};

    if (type == 'delete') {
      const cardId = args.input.cardId;
      await stripe.customers.deleteSource(
        stripeId,
        cardId,
      ).then(card => {
        dataMessage = { status: 200, messages: 'Card deleted successfully.' };
      }).catch(error => {
        dataMessage = { status: 401, messages: 'Something went wrong please try again.' };
      });
    } else if (type == 'default') {
      const cardId = args.input.cardId;
      await stripe.customers.update(
        stripeId,
        { default_source: cardId },
      ).then(card => {
        dataMessage = { status: 200, messages: 'Default card saved successfully.' };
      }).catch(error => {
        dataMessage = { status: 401, messages: 'Something went wrong please try again.' };
      });
    } else if (type == 'update') {
      const cardId = args.input.cardId;
      await stripe.customers.updateSource(
        stripeId,
        cardId,
        {
          name: args.input.name,
          exp_month: args.input.exp_month,
          exp_year: args.input.exp_year,
        }
      ).then(card => {
        dataMessage = { status: 200, messages: 'Card updated successfully.' };
      }).catch(err => {
        dataMessage = { status: 401, messages: err.message };
      });
    } else {
      try {
        await stripe.tokens.create({
          card: {
            name: args.input.name,
            number: args.input.card_number,
            exp_month: args.input.exp_month,
            exp_year: args.input.exp_year,
            cvc: args.input.cvc,
          }
        }).then(async (token) => {
          await stripe.customers.createSource(
            stripeId,
            { source: token.id }).then(card => {
              dataMessage = { status: 200, messages: 'Card added successfully' };
            }).catch(err => {
              dataMessage = { status: 401, messages: err.message };
            });
        }).catch(err => {
          dataMessage = { status: 401, messages: err.message };
        });
      } catch (e) {
        await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
        throw e;
      }
    }
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
    return {
      data: dataMessage,
      query: build.$$isQuery,
    };
  }
} 
