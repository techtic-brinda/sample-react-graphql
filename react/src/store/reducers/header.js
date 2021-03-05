import { 
  GET_ALL_HEADER,
  GET_PAGE_DETAIL,
  HEADER_LOADERS,
} from "../actions";

const initialState = {
  pages: [],
  page: [],
  errorMessage: null,
  successMessage: null,
  loader: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case HEADER_LOADERS:
      return {
        ...state,
        loader: payload,
    };
    case GET_ALL_HEADER:
      return {
        ...state,
        pages: payload,
    };
    case GET_PAGE_DETAIL:
      // console.log(payload,"reducer payload value for page detail");
      return {
        ...state,
        page: payload,
    };
    default:
      return state;
  }
};
