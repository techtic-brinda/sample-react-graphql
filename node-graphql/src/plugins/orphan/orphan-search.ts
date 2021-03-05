import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

const SEARCH_ORPHAN = gql`
    input SearchOrphanInput {
      filter: JSON,
    }
    type Orphans {
        id: Int
        user_id: Int
        first_name: String
        last_name: String
        middel_name: String
        date_of_birth: Date
        country_of_birth: String
        comments: String
        gender: String
        image: String
        age: Int
        is_donated: String
    }
    type response_orphans {
      status: Int!
      messages:String
      data: [Orphans]
    }
    type SearchOrphanPayload {
        data:response_orphans
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class OrphanSearch {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'orphanSearch(input: SearchOrphanInput!)',
    fieldType: 'SearchOrphanPayload',
    additionalGraphql: SEARCH_ORPHAN,
  })
  public async orphanSearch(_mutation: any,
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
      const { gender = '', age = '', name = '', category = '', fund = '', roleName = 'Champion', location ='', id = '' } = args.input.filter;
      let query = '';
      if (roleName == 'Champion') {
        query = query + `select * from orphans WHERE id NOT IN (SELECT DISTINCT champion_request.orphan_id FROM champion_request) AND deleted_at is null and status = 'active'`;
      }

      if (roleName == 'Angel') {
        query = query + `select * from orphans WHERE deleted_at IS NULL and status = 'active'`;
      }

      if (id != '' && roleName == 'Angel') {
        query = `select *, CASE WHEN id IN (select DISTINCT orphans.id FROM orphans right join donations on donations.user_id =2 AND donations.orphan_id=orphans.id WHERE orphans.id is not null) THEN 'true' ELSE 'false' END is_donated from orphans where deleted_at IS NULL and status ='active' `;
      }
      
      if (location != '') {
        query = query + ` AND country_of_birth = '${location}'`;
      }
      if (gender != '') {
        query = query + ` AND gender = '${gender}'`;
      }
      if (age != '') {
        if(age == 'Above 21') {
          query = query + ` AND age > 21`;
        } else {
          const ageOption = age.split('-');
          query = query + ` AND age between ${ageOption[0]} AND ${ageOption[1]}`;
        }
      }
      if (name != '') {
        query = query + ` AND ( first_name ilike '%${name}%' or last_name ilike '%${name}%')`;
      }
      if (category != '') {
        query = query + ` AND id IN (select orphan_needs.orphan_id from orphan_needs where orphan_needs.title ilike '%${category}%')`;
      }
      if (fund != '') {
        query = query + ` AND id IN (select orphan_needs.orphan_id from orphan_needs where orphan_needs.amount <=  '${fund}')`;
      }
      await pgClient.query(query, (err, res) => {
        if (err) {
          throw err
        }
        if (res) {
          const { rows } = res
          dataMessage = { status: 200, data: rows, messages: 'Data not found!' };
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
