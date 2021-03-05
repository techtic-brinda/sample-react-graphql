import { makeAddPgTableConditionPlugin } from "graphile-utils";

export default makeAddPgTableConditionPlugin(
    "public",
    "blogs",
    "containsBlogByCategoryId",
    build => ({
        description:
            "Filters the list of users to only those which " +
            "contain posts written by the specified user.",
        type: build.graphql.GraphQLInt,
    }),
    (value, helpers) => {
        const { sql, sqlTableAlias } = helpers;
        const sqlIdentifier = sql.identifier(Symbol("blogByCategory"));
        return sql.fragment`exists(
      select 1
      from public.role_user as ${sqlIdentifier}
      where ${sqlIdentifier}.user_id = ${sqlTableAlias}.id
      and ${sqlIdentifier}.role_id = ${sql.value(value)}
    )`;
})
