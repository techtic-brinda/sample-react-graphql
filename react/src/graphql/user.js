import gql from 'graphql-tag';

const BasicUser = gql`
    fragment BasicUser on User {
        id
        firstName
        lastName
        email
        slug
        phone
        image
        address
    }
`

const FullUser = gql`
    fragment FullUser on User {
        email
        dob
        id
        firstName
        image
        slug
        status
        updatedAt
        lastName
        phone
        createdAt
        address
        updatedEmail
        stripeId
    }
`

export const UserFragment = {
    FullUser,
    BasicUser
}