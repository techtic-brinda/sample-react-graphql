import { SchemaType, ExtendSchema } from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { gql } from 'graphile-utils';

const SEARCH_ORPHAN = gql`
  input newOrphansInput {
    id: Int!
  }
  type newOrphan {
    name: String
    image: String
    id: Int
  }
  type currentStatusData {
    orphan_id: Int
    image: String
    orphan_name: String
    total_requirement: Float
    complete_requirement: Int
    pending_requirement: Int
    donation_count: Int
  }
  type response_newChild {
    status: Int!
    newChild: [newOrphan]
    currentStatus: [currentStatusData]
    totalChilds: Int
    noOfDonation: Int
  }
  type newOrphansPayload {
    data: response_newChild
    query: Query
  }
`;
@Injectable()
@SchemaType({ typeName: 'User' })
export class DashboardNewOrphans {
  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'dashboardData(input: newOrphansInput!)',
    fieldType: 'newOrphansPayload',
    additionalGraphql: SEARCH_ORPHAN,
  })
  public async dashboardData(
    _mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any,
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query('SAVEPOINT graphql_mutation');
    try {
      let dataMessage = {};
      const id = args.input.id;
      let roleId = null; // 3 = Champion // 2 = Angel
      let newChild = [];
      let currentStatus = [];
      let totalChilds = 0;
      let noOfDonation = 0;
      /* Get New child Data  */
      const { rows : [roles] } = await pgClient.query(`select role_id from role_user where user_id = ${id}`);
      roleId  = roles.role_id;
      
      let query;
      if (roleId == 3) {
        // tslint:disable-next-line: max-line-length
        query =`select concat(o.first_name,' ', o.last_name) AS name, o.image, o.id from orphans as o WHERE id NOT IN (SELECT DISTINCT champion_request.orphan_id FROM champion_request where champion_request.champion_id = ${id} )`;
      } else {
        // tslint:disable-next-line: max-line-length
        query = `select concat(o.first_name,' ', o.last_name) AS name, o.image, o.id from orphans as o
          WHERE o.id IN (SELECT DISTINCT champion_request.orphan_id
          FROM champion_request WHERE champion_request.status = 'active'
          and orphan_id not in (select orphan_id from donations where orphan_id = o.id))`;
      }
      query = query + ` ORDER BY o.created_at DESC LIMIT 3`;
      
      const { rows } = await pgClient.query(query);
      newChild = rows;
      /* End of Get New child Data  */

      /* Get Total childs Data  */
      let totalQuery = '';
      if (roleId == 3) {
        const { rows: [champion] } = await pgClient.query(`SELECT count(id) FROM champion_orphan where champion_orphan.champion_id = ${id}`);
        totalChilds = champion.count;
        const { rows: [donation] } = await pgClient.query(`SELECT count(id) FROM donations where user_id = ${id}`);
        noOfDonation = donation.count;
      } else {
        totalQuery = `SELECT SUM(amount) FROM donations where user_id = ${id}`;
        const { rows: [{sum}] } = await pgClient.query(totalQuery);
        totalChilds = (sum == null) ? 0 : sum;
        const { rows: [donation] } = await pgClient.query(`SELECT count(id) FROM donations where user_id = ${id}`);
        noOfDonation = donation.count;
      }
      /* Get Total childs Data  */
      /* Get Current Status Data  */
      let currentQuery = '';
      if (roleId == 3) {
        // tslint:disable-next-line: max-line-length
        currentQuery = `SELECT ons.orphan_id, o.image, concat(o.first_name,' ',o.last_name) as orphan_name, ons.amount as total_requirement, ons.received_donation_amount as complete_requirement,
          ons.amount - ons.received_donation_amount as pending_requirement,
          (select count(id) FROM donations as d where d.orphan_need_id = ons.id) as donation_count
          from orphan_needs as ons
          left join orphans as o on ons.orphan_id = o.id
          left join champion_orphan as co on ons.orphan_id = co.orphan_id
          where co.champion_id =${id} order by ons.id desc limit 3`;
      } else {
        // tslint:disable-next-line: max-line-length
        currentQuery = `SELECT ons.orphan_id, o.image, concat(o.first_name,' ',o.last_name) as orphan_name, ons.amount as total_requirement, ons.received_donation_amount as complete_requirement,
        ons.amount - ons.received_donation_amount as pending_requirement,
        (select count(id) FROM donations as d where d.orphan_need_id = ons.id) as donation_count
        from orphan_needs as ons
        left join orphans as o on ons.orphan_id = o.id
        left join champion_orphan as co on ons.orphan_id = co.orphan_id
        where co.orphan_id IN (SELECT champion_request.orphan_id FROM champion_request
        WHERE champion_request.status = 'active')
        and ons.id in (SELECT MAX(id) from orphan_needs GROUP BY orphan_id) limit 3`;
      }
      console.log(currentQuery,'currentQuery');
      // left join donations as d on o.id = d.orphan_id
      // WHERE d.user_id =${id} 
      
      currentStatus = await pgClient
        .query(currentQuery)
        .then(res => res.rows)
        .catch(e => []);
      /* End Current Status Data  */
      dataMessage = {
        status: 200,
        newChild: rows,
        totalChilds,
        currentStatus,
        noOfDonation
      };

      await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
      return {
        data: dataMessage,
        query: build.$$isQuery,
      };
    } catch (e) {
      throw e;
    }
  }
}
