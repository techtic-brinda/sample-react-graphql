import { SET_USER_TOKEN, SET_USER, AUTH_SUCCESS, LOGOUT_USER, AUTH_ERROR,FORGOT_PASSWORD_USER,GET_ALL_CATEGORIES,GET_ALL_CATEGORIES_ERROR, REMOVE_MESSAGES, FORGOT_PASS_ERROR } from '../actions';
import { getCookie } from '../../utils/cookie';

let token = null;
let user = null;

const initialState = {
    token,
    user,
    errorMessage: null,
    successMessage: null,
    forgotUser : null,
    categories : []
};
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_ALL_CATEGORIES_ERROR: 
        case REMOVE_MESSAGES:
            return {
                ...state,
                successMessage: null,
                errorMessage: null,
        };
        case AUTH_SUCCESS:
            return {
                ...state,
                successMessage: payload,
                errorMessage: null,
        };
        case FORGOT_PASSWORD_USER:
            return {
                ...state,
                forgotUser: payload,
        };
        case FORGOT_PASS_ERROR:
            return {
                ...state,
                successMessage: null,
                errorMessage: payload,
            };
        case AUTH_ERROR:
            return {
                ...state,
                successMessage: null,
                errorMessage: payload,
            };

        case SET_USER_TOKEN:
            return {
                ...state,
                token: payload,
            };
        case SET_USER:
            return {
                ...state,
                user: payload,
            };
        case GET_ALL_CATEGORIES:
            return {
                ...state,
                categories: payload,
            };
        case LOGOUT_USER:
            return {
                ...state,
                token: null,
                user: null,
            };
        default:
            try {
                token = getCookie('token');
                user = getCookie('user');
                user = decodeURIComponent(user);
                user = JSON.parse(user);
            } catch (error) {
                token = state.token
                user = state.user
            }
        
            return {
                ...state,
                token,
                user,
            };
    }
};
