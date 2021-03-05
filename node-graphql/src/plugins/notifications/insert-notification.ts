import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
import { isEmpty, each } from 'lodash';

const format = require('pg-format');
const INSERT_NOTIFY = gql`
    input AddNotifyInput {
      title: String,
      data: JSON,
      champion: Boolean,
      userId: Int,
    }
    type AddNotifyPayload {
        data:String
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class AddNotification {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'addNotify(input: AddNotifyInput!)',
    fieldType: 'AddNotifyPayload',
    additionalGraphql: INSERT_NOTIFY,
  })
  public async addNotify(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
    const {title, data, champion, userId = null} = args.input;
    let query = '';
    // tslint:disable-next-line: prefer-const
    if (userId == null) {
      if (champion) {
        query = 'select id from public.users WHERE id in (SELECT user_id FROM role_user WHERE role_id = 3)'; 
      } else {
        query = 'select id from public.users WHERE id in (SELECT user_id FROM role_user WHERE role_id = 2)'; 
      }
      await pgClient.query(query, async (err, res) => {
        if (err) {
          throw err
        }
        if (res) {
          const { rows } = res;
          if (!isEmpty(rows)) {
            let notificationQuery = [];
            each(rows, (row, index) => {
              notificationQuery[index] = [Number(row.id), title, data];
            });
            if (!isEmpty(notificationQuery)) {
              const insertNotQuery = format('INSERT INTO notifications (user_id, title, data) VALUES %L', notificationQuery);
              await pgClient.query(insertNotQuery);
            }
          }
        }
      });
    } else {
      const insertNotQuery = format('INSERT INTO notifications (user_id, title, data) VALUES (%s,%L,%L)', Number(userId), title, data);
      await pgClient.query(insertNotQuery);
    }
    
    await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
      return {
        data: 'data saved',
        query: build.$$isQuery,
      };
      
    } catch (e) {
      await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
      throw e;
    }
  }
}
