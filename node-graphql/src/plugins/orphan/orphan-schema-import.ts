import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";
const XLSX = require('xlsx');
const format = require('pg-format');

const IMPORT_ORPHAN = gql`
    input ImportOrphanInput {
        file: Upload!,
    }
    type File {
      filename: String!
      mimetype: String!
      encoding: String!
    }
    type IMPORT_RESPONSE {
        status: String
        messages: String
    }
    type ImportOrphanPayload {
        data: IMPORT_RESPONSE
        query: Query
    }
`;
@Injectable()
@SchemaType({ typeName: 'User' })

export class OrphanImport {
  public getileData(file) {
    const workbook = XLSX.read(file, { type: 'base64'})
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_row_object_array(ws, {raw:false,dateNF:'yyyy-mm-dd'});
    return data;
  }

  @ExtendSchema({
    typeName: 'Mutation',
    fieldName: 'orphanImport(input: ImportOrphanInput!)',
    fieldType: 'ImportOrphanPayload',
    additionalGraphql: IMPORT_ORPHAN,
  })
  public async orphanImport(_mutation: any,
    args: any,
    context: any,
    resolveInfo: { graphile: GraphileHelpers<any> },
    build: any
  ) {
    const { pgSql: sql } = build;
    const { pgClient } = context;
    await pgClient.query('SAVEPOINT graphql_mutation');
    try {
        let dataMessage = {};
        const file = args.input.file;
        const matches = file.match(/^data:(.+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            dataMessage = { status: 401, messages: 'No file found!' };
        } else {
          const data =  await this.getileData(file);
          let insertValues = [];
          if(data.length > 0 ) {
            for(let i = 0; i < data.length; i++) {
              let rowdata = [];
              rowdata.push(data[i]['firstName'] ? data[i]['firstName'] : '');
              rowdata.push(data[i]['middleName'] ? data[i]['middleName'] : '');
              rowdata.push(data[i]['lastName'] ? data[i]['lastName'] : '');
              rowdata.push(data[i]['dateofbirth'] ? data[i]['dateofbirth'] : null);
              rowdata.push(data[i]['placeofbirth'] ? data[i]['placeofbirth'] : null);
              rowdata.push(data[i]['nationality'] ? data[i]['nationality'] : null);
              rowdata.push(data[i]['comments'] ? data[i]['comments'] : null);
              
              const queryCount = `select count(id) from orphans where first_name='${data[i]['firstName']}' AND last_name = '${data[i]['lastName']}' AND deleted_at IS NULL`;
              const { rows : [ { count }] } = await pgClient.query(queryCount);
              
              if (count == 0) {
                var found = false;
                for(var k = 0; k < insertValues.length; k++) {
                  if (insertValues[k].length && insertValues[k][0].toLowerCase() == rowdata[0].toLowerCase() && insertValues[k][2].toLowerCase() == rowdata[2].toLowerCase()) {
                      found = true;
                      break;
                  }
                }
                if(!found){
                  insertValues[i] = rowdata;
                }else{
                  insertValues[i] = []
                }                
              }else{
                insertValues[i] = []
              }
            }
            insertValues =  insertValues.filter(e => e.length);
            console.log(insertValues,'insertValues');
            // tslint:disable-next-line: max-line-length
            if(insertValues.length > 0) {        
              //tslint:disable-next-line: max-line-length
              const finalQuery = format('INSERT INTO orphans (first_name, middel_name, last_name, date_of_birth, place_of_birth, nationality, comments) VALUES %L', insertValues);
              pgClient.query(finalQuery, (queryError, result) => {
                  if (queryError) {
                    dataMessage = { status: 401, messages: 'Something went wrong!' };
                  }
                  if (result) {
                    dataMessage = { status: 200, messages: 'Data imported successfully' };
                  }
                });
            } else {
              dataMessage = { status: 200, messages: 'Already orphans imported.'};
            }
          }
        }
        await pgClient.query('RELEASE SAVEPOINT graphql_mutation');
        return {
          data: dataMessage,
          query: build.$$isQuery,
        };
      } catch (e) {
        await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
        throw e;
      }
    }
}
