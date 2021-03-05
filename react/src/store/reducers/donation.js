import {
  GET_DONATION_DETAILS,
  DONATION_DETAILS_SUCCESS,
  GET_SESSION_SUCCESS,
} from "../actions";

const initialState = {
  data: {},
  errorMessage: null,
  successMessage: null,
  sessionId: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case DONATION_DETAILS_SUCCESS:
      return {
        ...state,
        data: payload,
      };
    case GET_SESSION_SUCCESS:
      return {
        ...state,
        sessionId: payload,
      };

    default:
      return state;
  }
};
