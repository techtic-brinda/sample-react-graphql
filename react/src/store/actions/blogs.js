import gql from "graphql-tag";
import client from '../../../../admin/src/client';
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import { BlogFragment } from "./../../graphql/blog";
import { ToastsStore } from "./../../../packages/react-toasts";
import * as _ from "lodash";
import { PageInfoFragment } from "../../graphql/common";
import { OrphanCommentsFragment } from "./../../graphql/blog-comment";

export const GET_ALL_BLOGS = "GET_ALL_BLOGS";
export const GET_ALL_BLOGS_ERROR = "GET_ALL_BLOGS_ERROR";
export const GET_BLOG_DETAIL = "GET_BLOG_DETAIL";
export const GET_BLOG_DETAIL_ERROR = "GET_BLOG_DETAIL_ERROR";

export const GET_RELATED_BLOGS = "GET_RELATED_BLOGS";


export const GET_SEARCH_BLOGS = "GET_SEARCH_BLOGS";
export const GET_SEARCH_BLOGS_ERROR = "GET_SEARCH_BLOGS_ERROR";
export const REQUEST_SEARCH_GLOBAL_CHILDREN = "REQUEST_SEARCH_GLOBAL_CHILDREN";


export const ADD_BLOG_COMMENT = "ADD_BLOG_COMMENT";
export const GET_ALL_COMMENT_ERROR = "GET_ALL_COMMENT_ERROR";

function getBlogQuery(args = {}) {
	const { limit = 9, after, before, offset } = args;
	const GET_BLOGS_QUERY = gql`
		query blogs($limit: Int, $offset: Int) {
			blogs(condition : {status: "published"}, first: $limit, offset: $offset)  {
				edges {
					node {
						id
						content
						title
						comments {
							totalCount
						}
						createdAt
						featuredImage
					}
				}
				totalCount
				pageInfo {
					...PageInfo
				}
			},
		}
		${PageInfoFragment}
	`;
	return apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_BLOGS_QUERY,
		variables: { limit, offset }
	});
}
export function getAllBlogs(offset) {

	return (dispatch, getState) => {
		const state = getState();
		let pageType = {};
		if (offset != undefined) {
			pageType = { offset: offset }
		}
		getBlogQuery(pageType).then((response) => {
			dispatch({
				type: GET_ALL_BLOGS,
				payload: response.data.blogs,
			});
		}).catch((error) => {
			ToastsStore.error('Something went wrong. Please try again later.');
			throw error;
		});
	}
}

export function getRelatedBlogs(categoryIds, blogId) {

	const GET_RELATED_BLOG_QUERY = gql`
		query blogBlogCategories($catIds:[BigInt!],$id:BigInt!) {
			blogBlogCategories(filter: {blogCategoryId: {in: $catIds}, blog: {id: {notEqualTo: $id}}}, last: 3) {
			edges {
				node {
					blog {
					id
					title
					createdAt
					content
					featuredImage
					comments {
						totalCount
					}
					}
				}
			}
		}
	
	}
	`
	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_RELATED_BLOG_QUERY,
		variables: { catIds: categoryIds, id: blogId }
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_RELATED_BLOGS,
					payload: response.data.blogBlogCategories.edges.length > 0 ? response.data.blogBlogCategories.edges.map((item) => item.node.blog) : [],
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
	${BlogFragment.BlogDetail}`;

	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_BLOGS_QUERY,
		variables: { id }
	});

	return (dispatch) =>
		request
			.then((response) => {
				const blog = response.data.blog
				Promise.all([
					dispatch({
						type: GET_BLOG_DETAIL,
						payload: blog,
					})
				]).then(() => {
					if (blog.blogBlogCategories.nodes.length > 0) {
						const blogCategoryIds = blog.blogBlogCategories.nodes.map((item) => item.blogCategoryId);
						dispatch(getRelatedBlogs(blogCategoryIds, id))
					} else {
						dispatch({
							type: GET_RELATED_BLOGS,
							payload: [],
						});
					}
				})
			})
			.catch((error) => {
				dispatch({
					type: GET_BLOG_DETAIL_ERROR,
					payload: parseError(error),
				});
				throw error;
			});
}

export const requestSearch = () => ({
	type: REQUEST_SEARCH_GLOBAL_CHILDREN,
});

export function searchBlog(text) {
	if (!text) {
		return (dispatch) => {
			dispatch({
				type: GET_SEARCH_BLOGS,
				payload: [],
			});
		}
	}
	const SERACH_GLOBAL_BLOG = gql`  
	query blogs($text: String) {
		blogs(filter: { title: { includesInsensitive: $text }, and: {status: {equalTo: "published"}} } ){
			edges {
				node {
				  id
				  title
				}
			}
		}	
	}
	`;
	const request = apolloClient.mutate({
		mutation: SERACH_GLOBAL_BLOG,
		variables: { text: text },
	});
	return (dispatch) => {
		dispatch(requestSearch());
		request
			.then((response) => {
				dispatch({
					type: GET_SEARCH_BLOGS,
					payload: response.data.blogs.edges.length > 0 ? response.data.blogs.edges.map((item) => item.node) : [],
				});
			})
			.catch((error) => {
				ToastsStore.error('Something went wrong. Please try again later.');
				throw error;
			});
	}
}

export function addComments(data) {
	console.log(data, "function");
	const CREATE_ORPHAN_MUTATION = gql`
	mutation createComment($input: CommentInput!) {
	  createComment(input: { comment: $input}) {
		comment {
				...FullBlogComment
			}
		}
	}
	${OrphanCommentsFragment.FullBlogComment}
  `;

	return (dispatch, getState) => {
		const input = {
			userId: data.userId,
			blogId: data.blogId,
			phone: data.phone,
			comment: data.comment,
			name: data.name,
			email: data.email,
		}
		const request = client.mutate({ mutation: CREATE_ORPHAN_MUTATION, variables: { input } });
		request
			.then((response) => {
				ToastsStore.success("Comment added successfully.");
				dispatch({
					type: ADD_BLOG_COMMENT,
					payload: response.data.createComment.comment,
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_ALL_COMMENT_ERROR,
					payload: parseError(error),
				});
				throw error;
			});
	};
}
