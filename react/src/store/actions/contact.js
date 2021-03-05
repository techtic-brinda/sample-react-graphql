import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { ToastsStore } from "../../../packages/react-toasts";

export const GET_ALL_SETTINGS = 'GET_ALL_SETTINGS';
export const CONTAC_US_SUCCESS = 'CONTAC_US_SUCCESS';
export const CONTAC_US_ERROR = 'CONTAC_US_ERROR';


export function getSettings() {
    const GET_SETTINGS = gql`
      query settings {
        settings{
            nodes {
                key
                value
            }
        }
      }
    `;

    const request = apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SETTINGS,
    });

    return (dispatch) =>
        request
            .then((response) => {
                dispatch({
                    type: GET_ALL_SETTINGS,
                    payload: response.data.settings.nodes,
                });
            })
            .catch((error) => {
                ToastsStore.error('Something went wrong. Please try again later.');
                throw error;
            });
}

export function sendMessage(requestData) {
    const SEND_CONTAC_US = gql`
        mutation ($id: Int, $email:String!, $name:String, $phone:String, $messageBody:String) {
            userContacUsEmail(input: { id: $id, email: $email, name: $name, phone: $phone,messageBody: $messageBody }) {
                data {
                    messages
                    status
                }
            }
        }`
    const request = apolloClient.mutate({ mutation: SEND_CONTAC_US, variables: { ...requestData } });
    return (dispatch) => {
        return request.then((response) => {
            ToastsStore.success('Message sent successfullly.');
            dispatch({
                type: CONTAC_US_SUCCESS,
                payload: 'success',
            });
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
        });
    };
}

