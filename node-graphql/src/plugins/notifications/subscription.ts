import { SchemaType, ExtendSchema } from 'src/packages/postgraphile';
import { Injectable } from '@nestjs/common';
import { gql, embed } from 'graphile-utils';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';

const currentUserTopicFromContext = (_args: any, context: any, _resolveInfo: any) => {
    console.log(context);
    if (context.jwtClaims && context.jwtClaims.user_id) {
        return `notification:${context.jwtClaims.user_id}`;
    } else {
        throw new Error('You\'re not logged in');
    }
};

const SCHEMA = gql`
     type NotificationSubscriptionPayload {
      # This is populated by our resolver below
      notification: Notification

      # This is returned directly from the PostgreSQL subscription payload (JSON object)
      event: String
    }

    extend type Subscription {
      notificationRecived: NotificationSubscriptionPayload @pgSubscription(topic: ${embed(currentUserTopicFromContext)})
    }
`;
@Injectable()
@SchemaType({ typeName: 'Notification' })
export class Notification {

    @ExtendSchema({
        // typeName: 'Subscription',
        fieldName: `notificationRecived`,
        fieldType: `NotificationSubscriptionPayload`,
        additionalGraphql: SCHEMA,
    })
    public async notificationSubscription(
        event: any,
        args: any,
        context: any,
        resolveInfo: { graphile: GraphileHelpers<any> },
        build: any,
    ) {
        console.log({ event, args, context });

        const { pgClient } = context;
        await pgClient.query('SAVEPOINT graphql_mutation');
        try {

            const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
                pgClient.fragment`notifications`,
                (tableAlias, sqlBuilder) => {
                    sqlBuilder.where(
                        pgClient.fragment`${tableAlias}.user_id = ${pgClient.value(event.subject)}`,
                    );
                },
            );

            return {
                data: {
                    notification: rows[0],
                    event,
                },
                query: build.$$isQuery,
            };
        } catch (e) {
            await pgClient.query('ROLLBACK TO SAVEPOINT graphql_mutation');
            throw e;
        }
    }
}
