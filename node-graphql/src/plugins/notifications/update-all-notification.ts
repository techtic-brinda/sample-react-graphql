import { SchemaType, ExtendSchema } from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { gql } from "graphile-utils";
const moment = require('moment');
const format = require('pg-format');
const INSERT_NOTIFICATION = gql`
    input UpdateAllNotificationInput {
      userId: BigInt,
    }
    type UpdateAllNotificationPayload {
        data:String
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UpdateAllNotification {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'updateAllNotification(input: UpdateAllNotificationInput!)',
    fieldType: 'UpdateAllNotificationPayload',
    additionalGraphql: INSERT_NOTIFICATION,
  })
  public async updateAllNotification(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgClient } = context;
    const { userId} = args.input;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
        const updateAllNotification = format('UPDATE notifications set read_at = %L where user_id = %s' , moment().format(), Number(userId));
        await pgClient.query(updateAllNotification);
        await pgClient.query('SAVEPOINT graphql_mutation');
        
      await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
      return {
        data: 'Data saved',
        query: build.$$isQuery,
      };
    } catch (e) {
      await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
      throw e;
    }
  }
}
