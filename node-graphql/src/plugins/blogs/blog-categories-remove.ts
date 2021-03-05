import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
import { each } from 'lodash';
const format = require('pg-format');


const UPDATE_BLOG_CATEGORY_BLOG = gql`
    input UnassignBlogCategoryInput {
      blogCategoryId: Int!
    }

    type response_blog_category {
      status: Int!
      messages:String
    }

    type unassignBlogCategoryPayload {
        data:response_blog_category
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class UnassignBlogCategoryAfterRemove {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'unassignBlogCategory(input: UnassignBlogCategoryInput!)',
    fieldType: 'unassignBlogCategoryPayload',
    additionalGraphql: UPDATE_BLOG_CATEGORY_BLOG,
  })
  public async unassignBlogCategory(_mutation: any,
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
      const { blogCategoryId } = args.input;
      let newBlogCategoryId = null;
      const { rows } = await pgClient.query(`select id from blog_categories where slug = $1`, ["unassigned-category"]);
      if(rows.length <= 0) {
        newBlogCategoryId = await pgClient.query('INSERT INTO blog_categories(name, slug, status) VALUES($1, $2, $3) RETURNING *', ["Unassigned category", "unassigned-category", "active"])
        .then(res => res.rows[0].id)
        .catch(e => null);
      } else {
        newBlogCategoryId = rows[0].id;
      }
      if(newBlogCategoryId) {
        let query = `select * from blog_blog_category WHERE blog_category_id = ${blogCategoryId}`
        await pgClient.query(query, (err, res) => {
          if (err) {
            throw err
          }
          if (res) {
            const { rows } = res;
            if(rows.length > 0){
              each(rows, async(row, index) => {
                await pgClient.query(`UPDATE public.blog_blog_category SET blog_category_id = $1 where blog_category_id = $2 and blog_id = $3`, [newBlogCategoryId, blogCategoryId, row.blog_id]);
              });
            }
          }
        })
      }

      dataMessage = { status: 200, messages: `success` };
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
