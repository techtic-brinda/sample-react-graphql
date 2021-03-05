import { 
  GET_SPONSERS, 
  GET_SPONSER_DETAIL,
} from "../actions";

const initialState = {
  items: [],
  errorMessage: null,
  successMessage: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    
    case GET_SPONSERS:
      return {
        ...state,
        items: payload,
    };
    case GET_SPONSER_DETAIL:
      return {
        ...state,
        successMessage: payload,
        errorMessage: null,
    };
    default:
      return state;
  }
};
