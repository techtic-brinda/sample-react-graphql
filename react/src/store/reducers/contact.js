import { 
  GET_ALL_SETTINGS, 
  CONTAC_US_SUCCESS,
  CONTAC_US_ERROR,
} from "../actions";

const initialState = {
  data: [],
  errorMessage: null,
  successMessage: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    
    case GET_ALL_SETTINGS:
      return {
        ...state,
        data: payload,
    };
    case CONTAC_US_SUCCESS:
      return {
        ...state,
        successMessage: payload,
        errorMessage: null,
    };
    case CONTAC_US_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: payload,
    };
    default:
      return state;
  }
};
