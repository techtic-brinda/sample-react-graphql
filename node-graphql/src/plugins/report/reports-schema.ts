import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

const GET_REPORT = gql`
    input ReportsInput {
      id: Int!
      roleName: String
      filter : JSON
    }
    type filters{
      location: String
      month: String
      year: String
    }
    type Report {
        id: Int
        amount: String
        orphan_first_name: String
        orphan_last_name: String
        angel_first_name: String
        angel_last_name: String
        angel_email: String
        angel_address: String
        angel_phone: String
        transaction_id:String
        orphan_date_of_birth : Date
        orphan_country_of_birth: String
        orphan_institution_name: String
        orphan_description: String
        orphan_age: String
        orphan_name: String
        totalrequirement: Float
        totaldonations: Float
        donation_amount: Int
        age: Int
        created_at : Date
    }
    type totals{
      adoptedChild:Float
      donation : Float
      requirement : Float
      requirementComplete : Float
      requirementPending : Float
    }

    type response_report {
      status: Int!
      messages:String
      data: [Report]
      total : Float
      totalData : totals
      filtersData : filters
    }
    type ReportsPayload {
        data:response_report
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class Reports {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'reports(input: ReportsInput!)',
    fieldType: 'ReportsPayload',
    additionalGraphql: GET_REPORT,
  })
  public async reports(_mutation: any,
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
      const roleName = args.input.roleName;
      const id = args.input.id;
      const { location = null, date = null, year = null, month = null } = args.input.filter;
      let sumQuery = '';
      let query = '';
      let totalAdoptedChild = 0;
      let totalDonation = 0;
      let donationTotalNeeded = 0;
      let pendingRequest = 0;
      let completedRequest = 0;
      if (roleName == 'Angel') {
        sumQuery = 'select sum(amount) from donations'
        query = `select us.first_name as angel_first_name, us.last_name as angel_last_name, 
                    us.email as angel_email, us.address as angel_address, us.phone as angel_phone, 
                    d.transaction_id, d.created_at, d.amount, d.id,
                    o.first_name as orphan_first_name, o.last_name as orphan_last_name, 
                    o.age as orphan_age, o.date_of_birth as orphan_date_of_birth, 
                    o.country_of_birth as orphan_country_of_birth, inst.name as orphan_institution_name,
                    d.description as orphan_description
                    from donations as d 
                    left join orphans as o on d.orphan_id =o.id 
                    left join users as us on d.user_id =us.id
                    left join institutions as inst on o.institution_id =inst.id`
        query = query + ` WHERE d.user_id = '${id}'`;
        sumQuery = sumQuery + ` WHERE user_id = '${id}'`;
        if (location) {
          query = query + ` AND o.country_of_birth = '${location}'`;
        }
        if (date) {
          query = query + ` AND CAST(d.created_at AS DATE) = '${date}'`;
        }
        if (year) {
          query = query + ` AND EXTRACT(year FROM d.created_at) = '${year}'`;
        }
        if (month) {
          query = query + ` AND EXTRACT(month FROM d.created_at)  = '${month}'`;
        }
      } else {
        const { rows: [totalChild] } = await pgClient.query(`
        SELECT count(*) FROM champion_orphan as co
        left join champion_request as r on co.orphan_id = r.orphan_id
        where co.champion_id = '${id}' AND r.status = 'active'`);

        const { rows: [totalDonationQuery] } = await pgClient.query(`
        SELECT sum(d.amount) as total_donation FROM champion_orphan as co
        left join donations as d on co.orphan_id = d.orphan_id 
        where co.champion_id = '${id}'`);

        const { rows: [donationQuery] } = await pgClient.query(`
        SELECT sum(n.amount) as total_needed FROM champion_orphan as co
        left join orphan_needs as n on co.orphan_id = n.orphan_id
        where co.champion_id = '${id}'`);

        const { rows: [pendingRequestQuery] } = await pgClient.query(`
        SELECT (amount-received_donation_amount) as pendingRequestAmount FROM champion_orphan as co
        left join orphan_needs as n on co.orphan_id = n.orphan_id
        where co.champion_id = '${id}'`);

        const { rows: [completedRequestQuery] } = await pgClient.query(`
        SELECT received_donation_amount FROM champion_orphan as co
        left join orphan_needs as n on co.orphan_id = n.orphan_id
        where co.champion_id = '${id}'`);

        totalAdoptedChild = totalChild != null ? totalChild.count : 0;
        totalDonation = totalDonationQuery.total_donation;
        donationTotalNeeded = donationQuery.total_needed;
        pendingRequest = pendingRequestQuery != null ? pendingRequestQuery.pendingrequestamount : 0;
        completedRequest = completedRequestQuery != null ? completedRequestQuery.received_donation_amount : 0;

        sumQuery = 'select sum(amount) from donations'
        query = `select d.amount as donation_amount, us.first_name as angel_first_name, us.last_name as angel_last_name, 
                    us.email as angel_email, us.address as angel_address, us.phone as angel_phone, 
                    o.id, o.age, concat(o.first_name,' ', o.last_name) AS orphan_name,
                    o.first_name as orphan_first_name, o.last_name as orphan_last_name, 
                    o.age as orphan_age, o.date_of_birth as orphan_date_of_birth, 
                    o.country_of_birth as orphan_country_of_birth, inst.name as orphan_institution_name,
                    (select sum(amount) from orphan_needs where orphan_id = o.id) as totalRequirement,
                    (select sum(amount) from donations where orphan_id = o.id) as totalDonations
                    from orphans as o
                    left join champion_orphan as co on o.id = co.orphan_id
                    left join users as us on o.user_id =us.id
                    left join institutions as inst on o.institution_id =inst.id
                    left join donations as d on o.id =d.id`
        query = query + ` WHERE co.champion_id = '${id}'`;
        if (date) {
          query = query + ` AND CAST(o.created_at AS DATE) = '${date}'`;
        }
        if (year) {
          query = query + ` AND EXTRACT(year FROM o.created_at) = '${year}'`;
        }
        if (month) {
          query = query + ` AND EXTRACT(month FROM o.created_at)  = '${month}'`;
        }
        sumQuery = sumQuery + ` WHERE user_id = '${id}'`;
      }
      const { rows: [total] } = await pgClient.query(sumQuery);
      await pgClient.query(query, (err, res) => {
        if (err) {
          throw err;
        }
        if (res) {
          const { rows } = res;
          dataMessage = {
            status: 200,
            totalData: {
              adoptedChild: totalAdoptedChild,
              donation: totalDonation,
              requirement: donationTotalNeeded,
              requirementComplete: completedRequest,
              requirementPending: pendingRequest,
            },
            filtersData: args.input.filter,
            total: total.sum,
            data: rows
          };
        }
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

