import { 
  GET_ALL_CHILDRENS, 
  GET_ALL_CHILDRENS_ERROR,
  GET_CHILDREN_PROFILE,
  REQUEST_SEARCH_GLOBAL_CHILDREN,
  GET_SEARCH_CHILDRENS,
  GET_SEARCH_CHILDRENS_ERROR,
  REQUEST_ADOPT_CHILD,
  ADOPT_CHILD_REQUEST_SUCCESS,
  ADOPT_CHILD_REQUEST_ERROR,
  GET_ALL_ACTIVE_CHILDRENS,
  GET_ALL_PENDING_CHILDRENS,
  ADD_ORPHAN_DETAILS,
  GET_ALL_ORPHANS,
  LOAD_MORE_ORPHANS,
  SEARCH_LOADER,
} from "../actions";

const initialState = {
  pageInfo:{},
  edges: [],
  items: [],
  activeChildrens: {
    edges : [],
    pageInfo:{},
    totalCount: 0
  },
  pendingChildrens: [],
  childrenProfile:{},
  errorMessage: null,
  successMessage: null,
  loaders :{
    search : false,
    adoptRequest : false
  },
  searchOption : [],
  searchErrorMessage : null,
  adopt_child : null,
  addSuccess:null,
  searchloader : false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_ORPHANS:
      return {
          ...state,
          ...payload,
      };
    case LOAD_MORE_ORPHANS:
      return {
          ...state,
          edges: [...state.edges, ...payload.edges],
          pageInfo: payload.pageInfo
      };
    case SEARCH_LOADER:
      return {
        ...state,
        searchloader: payload,
    };
    case GET_ALL_CHILDRENS:
      return {
        ...state,
        items: payload,
    };
    case GET_CHILDREN_PROFILE:
      return {
        ...state,
        childrenProfile: payload,
        addSuccess:null
    };
    
    case GET_ALL_CHILDRENS_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: payload,
    };
    case REQUEST_SEARCH_GLOBAL_CHILDREN:
       return { 
         ...state,
         loaders: { ...state.loaders , search : true },
    };
    case GET_SEARCH_CHILDRENS:
      return {
        ...state,
        searchOption: payload,
        loaders: { ...state.loaders , search : false },
        searchloader: false,
    };
    
    case GET_SEARCH_CHILDRENS_ERROR:
      return {
        ...state,
        searchErrorMessage: payload,
        loaders: { ...state.loaders , search : false },
        searchloader: false,
    };

    case REQUEST_ADOPT_CHILD:
       return { 
         ...state,
         loaders: { ...state.loaders , adoptRequest : true },
    };

    case ADOPT_CHILD_REQUEST_SUCCESS:
      return {
        ...state,
        adopt_child: payload.orphanId,
        loaders: { ...state.loaders , adoptRequest : false },
        searchOption : state.searchOption.filter(item => item.id != payload.orphanId),
    };
    case ADOPT_CHILD_REQUEST_ERROR:
      return {
        ...state,
        adopt_child: null,
        errorMessage: payload,
    };
    case GET_ALL_ACTIVE_CHILDRENS:
      return {
        ...state,
        activeChildrens: payload,
    };
    case GET_ALL_PENDING_CHILDRENS:
      return {
        ...state,
        pendingChildrens: payload,
    };
    case ADD_ORPHAN_DETAILS:
      return {
        ...state,
        addSuccess: payload,
    };
    default:
      return state;
  }
};
