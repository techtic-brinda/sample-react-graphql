import { SchemaType, WrapResolver, ChangeNullability, ExtendSchema } from "src/packages/postgraphile";
import { Injectable } from "@nestjs/common";
import { GraphileHelpers } from "graphile-utils/node8plus/fieldHelpers";
import { gql } from "graphile-utils";

@Injectable()
@SchemaType({ typeName: 'User' })

export class UserType {

    // @WrapResolver({ fieldName: 'email', siblingColumns: [{ column: "id", alias: "$user_id" }] })
    // public alterEmail(resolve: any, user: any, args: any, context: any) {

    //     if (context.jwtClaims.user_id !== user.$user_id) {
    //         return null;
    //     } else {
    //         return resolve();
    //     }
    // }


    @ChangeNullability({ fieldName: 'email'})
    public alterEmail() {
        return true;
    }

    @ExtendSchema({
        typeName: 'Mutation', 
        fieldName: 'registerUser', 
        fieldType: 'User',
        additionalGraphql: gql`
            input RegisterUserInput {
                firstName: String!
                lastName: String
                email: String!
                password: String!
                role: Int
                phone: String
                dob: String
            }

            type RegisterUserPayload {
                user: User @pgField
                query: Query
            }
        `
    })
    public async dashboard(_mutation: any,
        args: any,
        context: any,
        resolveInfo: { graphile: GraphileHelpers<any> },
        build: any
    ) {
        const { pgSql: sql  } = build;
        const { pgClient } = context;
        // Start a sub-transaction
        await pgClient.query("SAVEPOINT graphql_dashboard_query");
        try {
            // Our custom logic to register the user:
            // const data = await pgClient.query(
            //     `SELECT register($1, $2, $3, $4, $5, $6, $7)`,
            //     [args.input.firstName, args.input.lastName, args.input.email, args.input.password, args.input.role, args.input.phone, args.input.dob]
            // );

            const data = await pgClient.query(
                `SELECT INTO registered_user id FROM users WHERE users.email = register.email;

                IF registered_user IS NOT NULL THEN
                    RAISE EXCEPTION 'Email is already registered. Please use another or try forgot password.';
                END IF;

                INSERT INTO users(first_name, last_name, email, phone, dob) VALUES($1, $2, $3, $6, $7) RETURNING * INTO person;
                INSERT INTO private.users(user_id, password) VALUES(person.id, $4);

                INSERT INTO role_user(user_id, role_id) VALUES(person.id, $5) ON CONFLICT DO NOTHING;
                RETURN person;
                `,
                [args.input.firstName, args.input.lastName, args.input.email, args.input.password, args.input.role, args.input.phone, args.input.dob]
            );

            const { rows: [user] } = data;

            const [
                row,
            ] = await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`users`,
                (tableAlias, queryBuilder) => {
                    queryBuilder.where(
                        sql.fragment`${tableAlias}.id = ${sql.value(user.id)}`
                    );
                }
            );
            
            // await sendEmail(
            //     args.input.email,
            //     "Welcome to my site",
            //     `You're user ${user.id} - ` + `thanks for being awesome`
            // );
            // Success! Write the user to the database.
            await pgClient.query("RELEASE SAVEPOINT graphql_dashboard_query");
            return {
                data: row,
                query: build.$$isQuery,
            };
        } catch (e) {
            console.log(e);
            // Oh noes! If at first you don't succeed,
            // destroy all evidence you ever tried.
            await pgClient.query("ROLLBACK TO SAVEPOINT graphql_dashboard_query");
            throw e;
        }
    }
   
} 
