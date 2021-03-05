import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import Router from 'next/router'
import { ToastsStore } from "./../../../packages/react-toasts";
import { setCookie, removeCookie } from '../../utils/cookie';

export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_USER = 'SET_USER';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const FORGOT_PASSWORD_USER = 'FORGOT_PASSWORD_USER';

export const GET_ALL_CATEGORIES = 'GET_ALL_CATEGORIES';
export const GET_ALL_CATEGORIES_ERROR = 'GET_ALL_CATEGORIES_ERROR';
export const REMOVE_MESSAGES = 'REMOVE_MESSAGES';
export const FORGOT_PASS_ERROR = 'FORGOT_PASS_ERROR';



export function login(data) {

    const SIGN_IN_MUTATION = gql`
        mutation ($email: String!, $password: String!) {
            authenticate(input: {email: $email, password: $password}) {
                jwtToken
            }
        }
    `
    const CURRENT_USER_QUERY = gql`
        query currentUserInfo {
            currentUserInfo {
                createdAt
                dob
                email
                emailVerifiedAt
                firstName
                id
                image
                lastName
                nodeId
                phone
                status
                slug
                updatedAt
                stripeId
                roleUsers {
                    nodes {
                     role {
                        name
                        id
                        }
                    }
                }
            }
        }
    `;

    const request = apolloClient.mutate({ mutation: SIGN_IN_MUTATION, variables: { ...data } });

    return async (dispatch, getState) => {
        request.then(async (response) => {
            dispatch(setUserToken(response.data.authenticate.jwtToken));
            try {
                const user = await apolloClient.query({ fetchPolicy: 'network-only', query: CURRENT_USER_QUERY }).then((res) => res.data.currentUserInfo)
                user.roleName = user.roleUsers.nodes ? user.roleUsers.nodes[0].role.name : ''
                if (user.roleName == 'Admin') {
                    dispatch({
                        type: AUTH_ERROR,
                        payload: 'The email account that you tried to reach" does not exist.',
                    })
                } else {
                    dispatch(setCurrentUser(user));
                    Router.push('/dashboard')
                } 
            } catch (error) {
                console.log(error);
            }

        }).catch((error) => {
            dispatch({
                type: AUTH_ERROR,
                payload: parseError(error),
            })
            throw error;
        });
    }
}
export function getCategories() {
    const GET_CATEGORIES_QUERY = gql`
        query categories {
        categories(filter: {deletedAt: {isNull: true}}, condition: {status: "active"}) {
            nodes {
                name
                id
            }
        }
    }
  `;
	const request = apolloClient.query({
		fetchPolicy: "network-only",
		query: GET_CATEGORIES_QUERY,
	});

	return (dispatch) =>
		request
        .then((response) => {
            dispatch({
                type: GET_ALL_CATEGORIES,
                payload: response.data.categories.nodes,
            });
        })
        .catch((error) => {
            dispatch({
                type: GET_ALL_CATEGORIES_ERROR,
                payload: parseError(error),
            });
            throw error;
        });
}
export function register(data) {

    const SIGN_UP_MUTATION = gql`
        mutation ($firstName: String!, $email: String!,  $password: String!, $lastName: String!) {
            register(input: {firstName: $firstName, email: $email, password: $password, lastName: $lastName}) {
                user {
                    id
                    status
                    slug
                    lastName
                    firstName
                    createdAt
                    updatedAt
                    email
                }
            }
        }
    `
    const EMAIL_VERIFICATION = gql`
    mutation ($id: Int!,$type:String!) {
        registerUser(input: { id: $id, type:$type }) {
            data {
                messages
                status
            }
        }
    }`
    const REGISTER_STRIPE_USER = gql`
    mutation ($email:String!) {
        registerStripeUser(input: { email: $email }) {
            data {
                messages
                data
            }
        }
    }`

    return async (dispatch) => {
        const request = apolloClient.mutate({ mutation: SIGN_UP_MUTATION, variables: { ...data } });
        request.then(async (response) => {
            const id = Number(response.data.register.user.id);
            const email = response.data.register.user.email;
            const type = 'new'
            await apolloClient.mutate({ mutation: EMAIL_VERIFICATION, variables: { id, type } }).then((res) => res.data)
            if (data.role === 2) {
                await apolloClient.mutate({ mutation: REGISTER_STRIPE_USER, variables: { email } }).then((res) => res.data)
            }
            // dispatch({
            //     type: AUTH_SUCCESS,
            //     payload: "You have register successfully. Please check your email to activate your account",
            // })
            ToastsStore.success('You have register successfully. Please check your email to activate your account.');
            Router.push('/')
        }).catch((error) => {
            dispatch({
                type: AUTH_ERROR,
                payload: parseError(error),
            })
        });
    }
}
export function verifyAccount(token) {
    const VERIFY_ACCOUNT_MUTATION = gql`
        mutation ($token: String!) {
            verifyAccount(input: { token: $token }) {
                boolean
            }
        }`
    const request = apolloClient.mutate({ mutation: VERIFY_ACCOUNT_MUTATION, variables: { token } });
    return (dispatch) => {
        return request.then((response) => {
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
        });
    };
}
export function verifyNewEmail(token) {
    const VERIFY_NEW_EMAIL_MUTATION = gql`
        mutation ($token: BigInt!) {
            verifyNewEmail(input: { token: $token }) {
                boolean
            }
        }`
    const request = apolloClient.mutate({ mutation: VERIFY_NEW_EMAIL_MUTATION, variables: { token } });
    return (dispatch) => {
        return request.then((response) => {
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
        });
    };
}
export function forgotPasswordUser(token) {
    const FORGOT_PASSWORD_USER_MUTATION = gql`
        mutation ($token: String!) {
            forgotPasswordUser(input: { token: $token }) {
                user {
                    id
                }
            }
        }`
    const request = apolloClient.mutate({ mutation: FORGOT_PASSWORD_USER_MUTATION, variables: { token } });
    return (dispatch) => {
        return request.then((response) => {
            dispatch({
                type: FORGOT_PASSWORD_USER,
                payload: response.data.forgotPasswordUser.user.id,
            })
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
        });
    };
}

export function forgotPassword(data) {

    const FORGOT_PASSWORD_MUTATION = gql`
        mutation ($email: String!) {
            forgotPassword(input: {email: $email}) {
                data {
                    status
                    messages
                }
            }
        }
    `
    return (dispatch, getState) => {
        const request = apolloClient.mutate({ mutation: FORGOT_PASSWORD_MUTATION, variables: { ...data } });
        request.then((response) => {
            if(response.data.forgotPassword.data.status == 200){
                dispatch({
                    type: AUTH_SUCCESS,
                    payload: "Reset password link send on you mail. Please check inbox.",
                })
            }else if(response.data.forgotPassword.data.status == 401){
                dispatch({
                    type: FORGOT_PASS_ERROR,
                    payload: response.data.forgotPassword.data.messages,
                })
            }else{
                dispatch({
                    type: FORGOT_PASS_ERROR,
                    payload: "Something went wrong. Please try again later.",
                })
            }
        }).catch((error) => {
            dispatch({
                type: AUTH_ERROR,
                payload: parseError(error),
            })
        });
    }
}
export function resetPassword(data) {

    const RESET_PASSWORD_MUTATION = gql`
        mutation ($userInId: BigInt!,$newPassword: String!) {
            resetPassword(input: {userInId:$userInId,newPassword: $newPassword}) {
                boolean
            }
        }
    `
    return (dispatch, getState) => {
        const request = apolloClient.mutate({ mutation: RESET_PASSWORD_MUTATION, variables: { ...data } });
        request.then((response) => {
            ToastsStore.success('Your password has been reset successfully!');
            Router.push('/')
        }).catch((error) => {
            dispatch({
                type: AUTH_ERROR,
                payload: parseError(error),
            })
        });
    }
}

export const setCurrentUser = (user) => {
    setCookie('user', JSON.stringify(user));
    return {
        type: SET_USER,
        payload: user,
    };
};

export const setUserToken = (token) => {
    setCookie('token', token);
    return {
        type: SET_USER_TOKEN,
        payload: token,
    };
};

export const logoutUser = () => {
    removeCookie('user');
    removeCookie('token');
    Router.push('/');
    return {
        type: LOGOUT_USER,
    };
};

export function removeMessage() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_MESSAGES,
            payload: true,
        })
    }
}
