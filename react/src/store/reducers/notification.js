import { GET_ALL_NOTIFICATIONS, LOAD_NEW_NOTIFICATIONS, LOAD_MORE_NOTIFICATIONS, UPDATE_UNREAD_NOTIFICATIONS_COUNTS } from "../actions";

const initialState = {
    pageInfo:{},
    edges: [],
    unreadCount: 0,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case GET_ALL_NOTIFICATIONS:
            return {
                ...state,
                ...payload,
            };

        case LOAD_NEW_NOTIFICATIONS:
            return {
                ...state,
                edges: [...payload.edges, ...state.edges],
            };
       
        case LOAD_MORE_NOTIFICATIONS:
            return {
                ...state,
                edges: [...state.edges, ...payload.edges],
                pageInfo: payload.pageInfo
            };
       
       
        case UPDATE_UNREAD_NOTIFICATIONS_COUNTS:
            return {
                ...state,
                unreadCount: payload
            };
       
        default:
            return state;
    }
};
