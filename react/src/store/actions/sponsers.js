import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { ToastsStore } from "../../../packages/react-toasts";
import { UserFragment } from "./../../graphql/user";
import { parseError } from "../../helpers";
export const GET_SPONSERS = 'GET_SPONSERS';
export const GET_SPONSER_DETAIL = 'GET_SPONSER_DETAIL';

export function getSponsers(userId) {
    const SPONSERS_MUTATION = gql`

  mutation getSponser($champion: Int) {
    getSponser(input: { champion:$champion}) {
        data {
            data {
                id
                comments
                created_at
                description
                amount
                orphan_fname
                orphan_id
                orphan_lname
                orphan_image
                sponser_fname
                sponser_lname
                sponser_image
                orphan_image
            }
            messages
            status
          }
      }
    }
  `;
    const request = apolloClient.mutate({
        mutation: SPONSERS_MUTATION,
        variables: { champion: Number(userId) },
    });


    return (dispatch) => {
        request
            .then((response) => {
                dispatch({
                    type: GET_SPONSERS,
                    payload: response.data.getSponser.data.data,
                });
            })
            .catch((error) => {
                ToastsStore.error("Something went wrong. Please try again!");
                throw error;
            });
    }
}
