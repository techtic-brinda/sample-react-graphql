import { GET_ALL_BLOGS, 
  GET_BLOG_DETAIL,
  GET_SEARCH_BLOGS,
  GET_ALL_BLOGS_ERROR,
  ADD_BLOG_COMMENT,
  GET_ALL_COMMENT_ERROR,
  GET_RELATED_BLOGS
} from "../actions";
import _ from 'lodash';
const initialState = {
  searchData:[],
  blogDetail: {},
  errorMessage: null,
  successMessage: null,
  items: {
    edges : [],
    totalCount: 0
  },
  relatedBlogs : []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    
    case GET_RELATED_BLOGS:
      return {
        ...state,
        relatedBlogs: payload,
    };
    case GET_ALL_BLOGS:
      return {
        ...state,
        items: payload,
    };
    case GET_SEARCH_BLOGS:
      return {
        ...state,
        searchData: payload,
    };
    case GET_BLOG_DETAIL:
      return {
        ...state,
        blogDetail: payload,
    };
    case GET_ALL_BLOGS_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: payload,
    };
    case ADD_BLOG_COMMENT:
      const dataBlog = _.setWith(state.blogDetail, '[comments][nodes]',state.blogDetail.comments.nodes.concat(payload));
      return {
        ...state,
        blogDetail : dataBlog,
    };
    case GET_ALL_COMMENT_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: payload,
    };
    default:
      return state;
  }
};
