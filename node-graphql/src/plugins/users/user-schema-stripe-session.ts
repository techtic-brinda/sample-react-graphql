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
        userId: Int!
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
      let dataMessage = { status : 200, messages:'', sessionId : null };
      let customer = args.input.customer;
      const meta = args.input.meta;
      const userId = args.input.userId;
      const orphanId = args.input.orphanId;
      const amount = parseFloat(args.input.amount);
      const totalAmount = parseFloat((amount * 100).toFixed(2));
      let userEmail = '';
      
      //Check user customer id exitst or not
      if(userId){
        const { rows : [user] } = await pgClient.query(`select * from users where id = $1`, [userId]);        
        if (user) {
          userEmail = user.email;
          if(!user.stripe_id){
            await stripe.customers.create({  email: userEmail })
              .then(async (customer) => {
                await pgClient.query(`UPDATE public.users SET stripe_id = $1 where email = $2`, [customer.id, userEmail]);
                customer = customer.id;
              }).catch(error => {
                dataMessage = { status: 401, messages: 'Something went wrong', sessionId: null };
              });
          }else{
            customer = user.stripe_id;
          }
        }else{
          dataMessage = { status: 401, messages: 'Something went wrong', sessionId: null };
        }
      }else{
        dataMessage = { status: 401, messages: 'User not found', sessionId: null };
      }
      
      // Check client id exstist or not
      try {
        let customerData = await stripe.customers.retrieve(customer);
        customer = customerData.id
      } catch (err) {
        await stripe.customers.create({  email: userEmail })
          .then(customer => {
            pgClient.query(`UPDATE public.users SET stripe_id = $1 where email = $2`, [customer.id, userEmail]);
            customer = customer.id;
          }).catch(error => {
            dataMessage = { status: 401, messages: 'Something went wrong', sessionId: null };
          });
        
      }

    
      
      if(dataMessage.status == 200){
        //Cretae stripe session token
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
              dataMessage = { status: 200, sessionId: response.id , messages: 'success' };
          }).catch(err => {
              console.log(err,' err');
              dataMessage = { status: 401, messages: err.message, sessionId: null };
          });
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
