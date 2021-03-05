import {
  GET_REPORTS,
  REPORTS_SUCCESS,
  GET_CHAMPION_REPORTS
} from "../actions";

const initialState = {
  data: {},
  championData: {},
  errorMessage: null,
  successMessage: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case GET_REPORTS:
      return {
        ...state,
        data: payload,
      };
    case GET_CHAMPION_REPORTS:
    return {
      ...state,
      championData: payload,
    };
    case REPORTS_SUCCESS:
      return {
        ...state,
      };
    default:
      return state;
  }
};
