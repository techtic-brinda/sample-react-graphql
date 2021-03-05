import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import { BlogFragment } from "./../../graphql/blog";
import { ToastsStore } from "./../../../packages/react-toasts";
import * as _ from "lodash";

export const GET_LAST_CHILD = "GET_LAST_CHILD";
export const GET_CONTENT = "GET_CONTENT";
export const GET_FAQS = "GET_FAQS";

export const GET_BLOG_DETAIL = "GET_BLOG_DETAIL";
export const GET_BLOG_DETAIL_ERROR = "GET_BLOG_DETAIL_ERROR";

export const GET_DASHBOARD_DETAIL = "GET_DASHBOARD_DETAIL";
export const GET_DASHBOARD_ORPHANS_DETAIL = "GET_DASHBOARD_ORPHANS_DETAIL";
export const GET_DASHBOARD_DETAIL_ERROR = "GET_DASHBOARD_DETAIL_ERROR";

export function getFaqs() {
	const GET_FAQS_QUERY = gql`
		query faqs{
			faqs(filter: {status: {equalTo: "active"}}){
				nodes {
					answer
					createdAt
					id
					nodeId
					question
					status
				}
			}
		}`;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_FAQS_QUERY,
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_FAQS,
					payload: response.data.faqs.nodes,
				});
			})
			.catch((error) => {
				ToastsStore.error('Something went wrong. Please try again later.');
				throw error;
			});
}

export function getContent(slug) {
	const GET_CONTENT_QUERY = gql`
    query pages($slug: String){
		pages(condition: {slug: $slug}){
			nodes {
				id
				metaTitle
				metaKeywords
				metaDescription
				slug
				title
				content
			}
		}
	}
  `;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_CONTENT_QUERY,
		variables: { slug }
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_CONTENT,
					payload: response.data.pages.nodes.length ? response.data.pages.nodes[0] : null,
				});
			})
			.catch((error) => {
				ToastsStore.error('Something went wrong. Please try again later.');
				throw error;
			});
}

export function getNewChild() {
	const GET_LAST_CHILD_QUERY = gql`
    query orphans{
		orphans(last: 4, filter: {deletedAt: {isNull: true}, and: {status: {equalTo: "active"}}}){
			nodes {
				id
				firstName
				lastName
				comments      
				image
			}
		}
	}
  `;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_LAST_CHILD_QUERY,
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_LAST_CHILD,
					payload: response.data.orphans.nodes,
				});
			})
			.catch((error) => {
				ToastsStore.error('Something went wrong. Please try again later.');
				throw error;
			});
}


export function getBlogDetail(id) {
	const GET_BLOGS_QUERY = gql`
    query blog($id:BigInt!) {
      blog(id: $id) {
          ...BlogDetail
      }
    }
	${BlogFragment.BlogDetail}
	`;
	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_BLOGS_QUERY,
		variables: { id }
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_BLOG_DETAIL,
					payload: response.data.blog,
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_BLOG_DETAIL_ERROR,
					payload: parseError(error),
				});
				throw error;
			});
}

export function getDashboardDetail(id) {
	console.log(id,'id');
	const GET_DASHBORD_QUERY = gql`
    mutation dashboardData($id:Int!) {
		dashboardData(input: { id: $id}) {
			data {
				currentStatus {
				  complete_requirement
				  donation_count
				  image
				  orphan_id
				  orphan_name
				  pending_requirement
				  total_requirement
				}
				newChild {
				  id
				  image
				  name
				}
				totalChilds
				noOfDonation
				status
			  }
      }
    }
	`;

	return (dispatch) => {
		const request = apolloClient.mutate({
			mutation: GET_DASHBORD_QUERY,
			variables: { id : Number(id) }
		});
		request.then((response) => {
			if (response.data.dashboardData.data.status == 200) {
				dispatch({
					type: GET_DASHBOARD_DETAIL,
					payload: response.data.dashboardData.data,
				});
			} else {
				ToastsStore.error('Something went wrong. Please try again later.');
			}
		}).catch((error) => {
			ToastsStore.error('Something went wrong. Please try again later.');
			throw error;
		});
	}
}

export function getDashboardOrphansDetail(id) {
	console.log(id, 'idssss');
	const GET_DASHBORD_ORPHANS_QUERY = gql`
    mutation myOrphansSearch($id:Int!) {
		myOrphansSearch(input: { id: $id}) {
			data {
				 messages
				 myOrphans {
					id
					first_name
					last_name
					date_of_birth
					country_of_birth
					description
					gender
					image
					age
					amount
					created_at
				}
				status
			  }
      }
    }
	`;

	return (dispatch) => {
		const request = apolloClient.mutate({
			mutation: GET_DASHBORD_ORPHANS_QUERY,
			variables: { id: Number(id) }
		});
		request.then((response) => {
			if (response.data.myOrphansSearch.data.status == 200) {
				dispatch({
					type: GET_DASHBOARD_ORPHANS_DETAIL,
					payload: response.data.myOrphansSearch.data,
				});
			} else {
				ToastsStore.error('Something went wrong. Please try again later.');
			}
		}).catch((error) => {
			ToastsStore.error('Something went wrong. Please try again later.');
			throw error;
		});
	}
}
