import { gql, makeExtendSchemaPlugin, embed } from 'postgraphile';

// tslint:disable-next-line: variable-name
const currentUserTopicFromContext = (_args: any, context: any, _resolveInfo: any) => {
    if (context.jwtClaims.user_id) {
        return `notification:${context.jwtClaims.user_id}`;
    } else {
        throw new Error('You\'re not logged in');
    }
};

export const NotificationSubscription = makeExtendSchemaPlugin(({ pgSql: sql }) => ({
    typeDefs: gql`
    type NotificationSubscriptionPayload {
      # This is populated by our resolver below
      notification: Notification

      # This is returned directly from the PostgreSQL subscription payload (JSON object)
      event: String
    }

    extend type Subscription {
      notificationRecived: NotificationSubscriptionPayload @pgSubscription(topic: ${embed( currentUserTopicFromContext )})
    }
  `,

    resolvers: {
        NotificationSubscriptionPayload: {
            // This method finds the user from the database based on the event
            // published by PostgreSQL.
            //
            // In a future release, we hope to enable you to replace this entire
            // method with a small schema directive above, should you so desire. It's
            // mostly boilerplate.
            // tslint:disable-next-line: variable-name
            async notification( event, _args, _context, { graphile: { selectGraphQLResultFromTable } } ) {
                console.log({ event, _args, _context });
                const rows = await selectGraphQLResultFromTable(
                    sql.fragment`notifications`,
                    (tableAlias, sqlBuilder) => {
                        sqlBuilder.where(
                            sql.fragment`${tableAlias}.user_id = ${sql.value(event.subject)}`,
                        );
                    },
                );
                return rows[0];
            },
        },
    },
}));
