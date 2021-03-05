import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

const SEARCH_ORPHAN = gql`
    input SponsersInput {
      champion: Int,
    }
    type Sponsers {
        id: Int
        description:String
        orphan_id:String
        amount:String
        created_at:Date
        sponser_fname:String
        sponser_lname:String
        orphan_fname:String
        orphan_lname:String
        comments:String
        sponser_image:String
        orphan_image:String
    }
    type RESPONSE_SPONSERS {
      status: Int!
      messages:String
      data: [Sponsers]
    }
    type SponsersPayload {
        data:RESPONSE_SPONSERS
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class Sponsers {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'getSponser(input: SponsersInput!)',
    fieldType: 'SponsersPayload',
    additionalGraphql: SEARCH_ORPHAN,
  })
  public async getSponser(_mutation: any,
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

      const champion = args.input.champion;
      let query = `select d.id,d.description, d.orphan_id, d.amount, d.created_at, 
                    s.first_name as sponser_fname, 
                    s.last_name as last_name ,
                    s.last_name as sponser_lname, s.image as sponser_image,
                    o.first_name as orphan_fname, o.last_name as orphan_lname, 
                    o.comments, o.image as orphan_image
                    from donations as d 
                    left join users as s on d.user_id = s.id
                    left join orphans as o on d.orphan_id = o.id
                    left join champion_orphan as b on d.orphan_id = b.orphan_id
                    where b.champion_id = ${champion} and d.id in (SELECT MAX(id) from donations GROUP BY user_id)`;
      await pgClient.query(query, (err, res) => {
        if (err) {
          throw err
        }
        if (res) {
          const { rows } = res
          dataMessage = { status: 200, data: rows, messages: 'Success' };
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
