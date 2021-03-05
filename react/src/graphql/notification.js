import gql from 'graphql-tag';

const Notification = gql`
    fragment Notification on Notification {
        data
        createdAt
        id
        nodeId
        readAt
        title
        updatedAt
        userId
        user {
            id
            image
            firstName
            lastName
        }
    }
`

export const NotificationFragment = {
    Notification
}