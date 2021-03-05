import { GET_USER_PROFILE, 
  UPDATE_PASSWORD_ERROR,
  USER_PROFILE_ERROR,
  GET_SECURITY_QUESTION,
  GET_SECURITY_QUESTION_ERROR,
  GET_LOCATION,
  GET_LOCATION_ERROR,
  ADD_SECURITY_QUESTION,
  UPDATE_SECURITY_QUESTION,
  ADD_CARD_SUCCESS,
  ADD_CARD_ERROR,
  GET_CARD_SUCCESS,
  GET_CARD_ERROR,
  DELETE_CARD_SUCCESS,
  UPDATE_CARD_SUCCESS,
  UPDATE_PASSWORD,
} from "../actions";

const initialState = {
  profile: {},
  securityQuestions : [],
  locations: [],
  errorMessage: null,
  successMessage: null,
  profileMessage : null,
  errorProfileMessage: null,
  errorPassMessage: null,
  errorSecurityMessage: null,
  updateCardSuccess: null,
  cards : [],
};

export default (state = initialState, { type, payload }) => {
  
  switch (type) {
    case ADD_SECURITY_QUESTION:
    case UPDATE_SECURITY_QUESTION:
    case UPDATE_CARD_SUCCESS:
      return {
        ...state,
        updateCardSuccess: payload,
        cardErrorMessage: null,
    };  
    case ADD_CARD_SUCCESS:
      return {
        ...state,
        cardSuccessMessage: payload,
        cardErrorMessage: null,
    };
    case DELETE_CARD_SUCCESS:
    case ADD_CARD_ERROR:
      return {
        ...state,
        cardSuccessMessage: null,
        cardErrorMessage: payload,
    };
    case GET_USER_PROFILE:
      return {
        ...state,
        profile: payload,
      };
    case GET_CARD_SUCCESS:
      return {
        ...state,
        cards: payload,
    };
    case GET_CARD_ERROR:
    case GET_SECURITY_QUESTION:
      return {
        ...state,
        securityQuestions: payload,
    };
    case GET_SECURITY_QUESTION_ERROR:
      return {
        ...state,
        successMessage: null,
        errorSecurityMessage: payload,
    };
    case GET_LOCATION:
      return {
        ...state,
        locations: payload,
      };
    case GET_LOCATION_ERROR:
      return {
        ...state,
        successMessage: null,
        errorLocationMessage: payload,
      };
    case USER_PROFILE_ERROR:
      return {
        ...state,
        successMessage: null,
        errorProfileMessage: payload,
      };
      
    case UPDATE_PASSWORD:
      return {
        ...state,
        profileMessage: 'success',
        errorPassMessage: null,
      };
    case UPDATE_PASSWORD_ERROR:
      return {
        ...state,
        successMessage: null,
        errorPassMessage: payload,
      };
    default:
      return state;
  }
};
