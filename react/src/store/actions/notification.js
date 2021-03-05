import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { ToastsStore } from "../../../packages/react-toasts";
import { NotificationFragment } from "../../graphql/notification";
import { PageInfoFragment } from "../../graphql/common";

export const GET_ALL_NOTIFICATIONS = 'GET_ALL_NOTIFICATIONS';
export const LOAD_NEW_NOTIFICATIONS = 'LOAD_NEW_NOTIFICATIONS';
export const LOAD_MORE_NOTIFICATIONS = 'LOAD_MORE_NOTIFICATIONS';
export const UPDATE_UNREAD_NOTIFICATIONS_COUNTS = 'UPDATE_UNREAD_NOTIFICATIONS_COUNTS';

export function addNotification(title, data, champion=true) {
    const CREATE_NOTIFICATION_MUTATION = gql`
        mutation addNotify($champion: Boolean, $data: JSON , $title: String) {
            addNotify(input: {champion: $champion, data: $data , title: $title}) {
                data
            }
        }
    `
    return () => {
        apolloClient.mutate({ 
            mutation: CREATE_NOTIFICATION_MUTATION, 
            variables: { 
                title :title,
                champion :champion,
                data: data, 
            } 
        });
     };
}

export function readNotification() {
    const READ_ALL_NOTIFICATIONS = gql`
        mutation updateAllNotification($userId: BigInt) {
            updateAllNotification(input: {userId: $userId}) {
                data
            }
        }
    `;
    return (dispatch,getState) => {
        const state = getState();
        const userId = Number(state.auth.user.id);
        apolloClient.mutate({ 
            mutation: READ_ALL_NOTIFICATIONS, 
            variables: { 
                userId :userId,
            }
        }).then(() => {
            dispatch(undreadCounts())
        });
     };
}

export function undreadCounts() {
    const query = gql`
        query notifications($userId: BigInt) {
            notifications(condition: {userId: $userId}, filter: {readAt: {isNull: true}}) {
                totalCount
            }
        }
    `;
    return (dispatch, getState) => {
        const state = getState();
        const userId = state.auth.user.id;
        apolloClient.query({
            fetchPolicy: "network-only",
            query,
            variables: { userId }
        }).then((response) => {
            dispatch({
                type: UPDATE_UNREAD_NOTIFICATIONS_COUNTS,
                payload: response.data.notifications.totalCount,
            });
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.unread');
            throw error;
        });
    }
}

function query(args = {}) {
    const { limit = 10, after, before, userId } = args;
    const GET_NOTIFICATIONS_QUERY = gql`
        query notifications($userId: BigInt, $limit: Int, $after: Cursor, $before: Cursor) {
            notifications(condition: {userId: $userId}, orderBy: CREATED_AT_DESC, first: $limit, after: $after, before: $before)  {
                edges {
                    cursor
                    node {
                        ...Notification
                    }
                }
                totalCount
                pageInfo {
                    ...PageInfo
                }
            },
        }
        ${NotificationFragment.Notification}
        ${PageInfoFragment}
    `;
    return apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_NOTIFICATIONS_QUERY,
        variables: { limit, after, before, userId }
    });
}

export function loadNewNotifications(cursor) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.auth != undefined && state.auth.user.id != undefined){
            if (cursor == undefined && state.notification.edges.length > 0){
                cursor = state.notification.edges[0].cursor;
            }
            query({ before: cursor, userId: state.auth.user.id }).then((response) => {
                dispatch({
                    type: LOAD_NEW_NOTIFICATIONS,
                    payload: response.data.notifications,
                });
                dispatch(undreadCounts())
            }).catch((error) => {
                ToastsStore.error('Something went wrong. Please try again later.');
                throw error;
            });
        }
    }
}

export function loadMoreNotifications(cursor) {
    return (dispatch, getState) => {
        const state = getState();
        query({ after: cursor, userId: state.auth.user.id }).then((response) => {
            dispatch({
                type: LOAD_MORE_NOTIFICATIONS,
                payload: response.data.notifications,
            }),
            dispatch(undreadCounts())
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}

export function getNotifications(args = {}) {
    return (dispatch, getState) => {
        const state = getState();
        query({ ...args, userId: state.auth.user.id }).then((response) => {
            dispatch({
                type: GET_ALL_NOTIFICATIONS,
                payload: response.data.notifications,
            }),
            dispatch(undreadCounts())
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}
