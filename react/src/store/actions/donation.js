import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { ToastsStore } from "../../../packages/react-toasts";
import _ from 'lodash';

export const GET_DONATION_DETAILS = 'GET_DONATION_DETAILS';
export const DONATION_DETAILS_SUCCESS = 'DONATION_DETAILS_SUCCESS';
export const GET_SESSION_SUCCESS = 'GET_SESSION_SUCCESS';

export function successPayment(sessionId,orphanId,userId){
    const PAYMENT_SUCCESS_MUTATION = gql`
        mutation ($sessionId: String!, $orphanId: Int! , $userId: Int!) {
            userStripeComplete(input: {sessionId: $sessionId, orphanId: $orphanId , userId: $userId}) {
                status
                messages
            }
        }
    `
    return (dispatch) => {
        const request = apolloClient.mutate({ 
            mutation: PAYMENT_SUCCESS_MUTATION, 
            fetchPolicy: "no-cache",
            variables: { 
                sessionId:sessionId,
                orphanId:Number(orphanId),
                userId:Number(userId),
            } 
        });
        request.then((response) => {
            if (response.data.userStripeComplete.status == 200) {
                ToastsStore.success(response.data.userStripeComplete.messages);
            } else {
                ToastsStore.error(response.data.userStripeComplete.messages);
            }
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}
export function getSessioToken(stripeId,orphanId,payment, userId){

    const GET_SESSION_TOKEN_MUTATION = gql`
        mutation ($customer: String!,$amount: Float!, $orphanId:Int!,$meta:JSON, $userId: Int!) {
            userStripeGetSession(input: {customer: $customer, amount:$amount, orphanId:$orphanId, meta:$meta, userId: $userId}) {
                data {
                    status
                    messages
                    sessionId
                }
            }
        }
    `
    return (dispatch) => {
        const request = apolloClient.mutate({ 
            mutation: GET_SESSION_TOKEN_MUTATION, 
            fetchPolicy: "no-cache",
            variables: { 
                customer:stripeId,
                amount: parseFloat(payment.totalAmount),
                orphanId : Number(orphanId),
                meta:payment,
                userId:userId,
             }
        });
        request.then((response) => {
            if (response.data.userStripeGetSession.data.status == 200) {
                dispatch({
                    type: GET_SESSION_SUCCESS,
                    payload: response.data.userStripeGetSession.data.sessionId,
                });
            } else {
                ToastsStore.error('Something went wrong. Please try again later.');
                return false
            }
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}
export function getDonationDetails(id) {
    const GET_DONATION_DETAILS = gql`
      query orphan($id:BigInt!) {
        orphan(id:$id){
            comments
            firstName
            image
            lastName
            id
            orphanNeeds {
                nodes {
                    amount
                    category {
                        id
                        name
                    }
                }
            }    
        }
      }
    `;

    const request = apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_DONATION_DETAILS,
        variables: { id }
    });

    return (dispatch) =>
        request
            .then((response) => {
                if(response.data.orphan.orphanNeeds.nodes.length >0){
                    const orPhanNeeds = response.data.orphan.orphanNeeds.nodes.filter(item=>{
                        item.amount = Number(item.amount)
                        return item
                    })
                    response.data.orphan.totalAmount = _.sumBy(orPhanNeeds, 'amount')
                }
                dispatch({
                    type: DONATION_DETAILS_SUCCESS,
                    payload: response.data.orphan,
                });
            })
            .catch((error) => {
                ToastsStore.error('Something went wrong. Please try again later.');
                throw error;
            });
}


