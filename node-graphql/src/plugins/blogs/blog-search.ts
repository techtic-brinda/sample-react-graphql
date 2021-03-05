import { SchemaType, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

const SEARCH_BLOG = gql`
    input SearchBlogInput {
      text: String
    }
    type Blogs {
        id: Int
        title: String
    }
    type response_blogs {
      status: Int!
      messages:String
      data: [Blogs]
    }
    type SearchBlogPayload {
        data:response_blogs
        query:Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class BlogSearch {

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'blogSearch(input: SearchBlogInput!)',
    fieldType: 'SearchBlogPayload',
    additionalGraphql: SEARCH_BLOG,
  })
  public async blogSearch(_mutation: any,
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
      
      const text = args.input.text
      

      let query = "select id, title from blogs WHERE blogs.status = 'active' "
      
      if (text != '') {
        query = query + ` AND title ilike '%${text}%'`;
      }
      
      await pgClient.query(query, (err, res) => {
        if (err) {
          throw err
        }
        if (res) {
          const { rows } = res
          dataMessage = { status: 200, data: rows, messages: `success` };
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
