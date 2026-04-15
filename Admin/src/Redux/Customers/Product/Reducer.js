// Redux reducer (customerProductReducer.js)
import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from "./ActionType";

const initialState = {
  // products will store the API shape { content: [], currentPage, totalPages }
  products: { content: [], currentPage: 1, totalPages: 1 },
  product: null,
  searchedProducts: [],
  loading: false,
  error: null,
  deleteProduct: null, // last deleted product id (useful to trigger re-fetch)
};

const customerProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIND_PRODUCTS_BY_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case FIND_PRODUCTS_BY_CATEGORY_SUCCESS:
      // action.payload expected to be the API response object
      return { ...state, products: action.payload || { content: [], currentPage: 1, totalPages: 0 }, loading: false };
    case FIND_PRODUCTS_BY_CATEGORY_FAILURE:
      return { ...state, loading: false, products: { content: [], currentPage: 1, totalPages: 0 }, error: action.payload };

    case FIND_PRODUCT_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FIND_PRODUCT_BY_ID_SUCCESS:
      return { ...state, product: action.payload, loading: false };
    case FIND_PRODUCT_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_PRODUCT_SUCCESS:
      // add new product to top of content array
      return {
        ...state,
        loading: false,
        products: {
          ...state.products,
          content: [action.payload, ...(state.products?.content || [])],
        },
      };
    case CREATE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: {
          ...state.products,
          content: (state.products?.content || []).map((p) => (p._id === action.payload._id ? action.payload : p)),
        },
      };
    case UPDATE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_PRODUCT_SUCCESS:
      // Remove deleted product from content array; also store deleted id (optional)
      return {
        ...state,
        loading: false,
        deleteProduct: action.payload,
        products: {
          ...state.products,
          content: (state.products?.content || []).filter((p) => p._id !== action.payload),
        },
      };
    case DELETE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SEARCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, searchedProducts: action.payload };
    case SEARCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload, searchedProducts: [] };

    default:
      return state;
  }
};

export default customerProductReducer;