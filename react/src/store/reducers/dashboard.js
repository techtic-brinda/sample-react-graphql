import {  
  GET_DASHBOARD_DETAIL,
  GET_DASHBOARD_ORPHANS_DETAIL,
  GET_DASHBOARD_DETAIL_ERROR,
  GET_LAST_CHILD,
  GET_CONTENT,
  GET_FAQS,
} from "../actions";

const initialState = {
  data: {},
  orphans: {},
  newOrphans: [],
  errorMessage: null,
  successMessage: null,
  content: null,
  faqs: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_DASHBOARD_DETAIL:
      return {
        ...state,
        data: payload,
    };
    case GET_CONTENT:
      return {
        ...state,
        content: payload,
    };
    case GET_FAQS:
      return {
        ...state,
        faqs: payload,
    };    
    case GET_LAST_CHILD:
      return {
        ...state,
        newOrphans: payload,
    };
    case GET_DASHBOARD_DETAIL_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: payload,
    };
    case GET_DASHBOARD_ORPHANS_DETAIL:
      return {
        ...state,
        orphans: payload,
      };
    default:
      return state;
  }
};
