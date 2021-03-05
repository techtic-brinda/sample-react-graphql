import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import { HeaderFragment } from "../../graphql/header";
import { ToastsStore } from "../../../packages/react-toasts";
import * as _ from "lodash";

export const GET_ALL_HEADER = "GET_ALL_HEADER";
export const GET_ALL_HEADER_ERROR = "GET_ALL_HEADER_ERROR";

export const GET_PAGE_DETAIL = "GET_PAGE_DETAIL";
export const GET_PAGE_DETAIL_ERROR = "GET_PAGE_DETAIL_ERROR";

export const HEADER_LOADERS 	= "HEADER_LOADERS";

export function getAllHeader() {
	const GET_HEADER_QUERY = gql`
    query pages {
      pages(condition: {status: "published"}) {
        nodes{
          ...HeaderPages
        }
      }
    }
	  ${HeaderFragment.HeaderPages}
	`;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_HEADER_QUERY
	});

	return (dispatch) => {
		dispatch({
			type: HEADER_LOADERS,
			payload: true,
		});
		request
			.then((response) => {
				dispatch({
					type: GET_ALL_HEADER,
					payload: response.data.pages.nodes,
				}),
				dispatch({ type: HEADER_LOADERS, payload: false});
			})
			.catch((error) => {
				dispatch({
					type: GET_ALL_HEADER_ERROR,
					payload: parseError(error),
				}),
				dispatch({ type: HEADER_LOADERS, payload: false});
				throw error;
		});
	 }
	}


export function getPageDetail(slug) {
	const GET_PAGE_DETAIL_QUERY = gql`
	query pages($slug: String!) {
		pages( condition: {slug: $slug}) {
		  nodes{
			...PageDetail
		  }
		}
	  }
	  ${HeaderFragment.PageDetail}
	`;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_PAGE_DETAIL_QUERY,
		variables: { slug }
	});

	return (dispatch) =>
		request
			.then((response) => {
				console.log(response, "action response");
				dispatch({
					type: GET_PAGE_DETAIL,
					payload: response.data.pages.nodes,
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_PAGE_DETAIL_ERROR,
					payload: parseError(error),
				});
				throw error;
			});
}
