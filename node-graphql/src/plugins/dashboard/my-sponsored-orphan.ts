import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

const SEARCH_ORPHAN = gql`
    input myOrphanInput {
      id: Int!,
    }
    type myOrphan {
        id: Int
        first_name: String
        last_name: String
        date_of_birth: Date
        country_of_birth: String
        description: String
        gender: String
        image: String
        age: Int
        amount: Int
        created_at: Date
    }
    type response_myOrphans {
      status: Int!
      messages:String
      myOrphans: [myOrphan]
    }
    type myOrphansPayload {
        data:response_myOrphans
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class myOrphanSearch {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'myOrphansSearch(input: myOrphanInput!)',
    fieldType: 'myOrphansPayload',
    additionalGraphql: SEARCH_ORPHAN,
  })
  public async myOrphansSearch(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query("SAVEPOINT graphql_mutation");
    try {
      let dataMessage = {};
      const id = args.input.id;
      let myOrphans = [];
      
      let query = 'select o_id, o.* FROM (select DISTINCT o_id FROM (';
      query = query + `select us.first_name as angel_first_name, us.last_name as angel_last_name, 
                    us.email as angel_email, us.address as angel_address, us.phone as angel_phone, 
                    d.transaction_id, d.created_at, d.amount, d.id,
                    o.id as o_id, o.first_name as first_name,o.middel_name as middel_name, o.last_name as last_name, 
                    o.age as age, o.date_of_birth as date_of_birth, o.gender as gender,
                    o.country_of_birth as country_of_birth,
                    d.description as description
                    from donations as d 
                    left join orphans as o on d.orphan_id = o.id 
                    left join users as us on d.user_id = us.id`;

      query = query + ` WHERE d.user_id = '${id}'`;
      query = query + ` ) as temp) as so left join orphans as o on so.o_id = o.id `;
      
      await pgClient.query(query, (err, res) => {
        if (err) {
          throw err
        }
        if (res) {
          const { rows } = res
          myOrphans = rows;
          dataMessage = {
            status: 200,
            messages:'success',
            myOrphans: rows
          };
        }
      })

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
