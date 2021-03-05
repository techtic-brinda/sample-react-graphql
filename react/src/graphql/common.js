import gql from 'graphql-tag';

export const PageInfoFragment = gql`
    fragment PageInfo on PageInfo {
        
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
    }
`
