import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  GET_USER_ADDRESSES_REQUEST,
  GET_USER_ADDRESSES_SUCCESS,
  GET_USER_ADDRESSES_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAILURE,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "./actionType";

const initialState = {
  user: null,
  token: localStorage.getItem("jwt") || null,
  isLoading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
      };
    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case ADD_ADDRESS_FAILURE:
    case GET_USER_ADDRESSES_FAILURE:
    case DELETE_ADDRESS_FAILURE:
    case UPDATE_ADDRESS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case ADD_ADDRESS_REQUEST:
    case GET_USER_ADDRESSES_REQUEST:
    case DELETE_ADDRESS_REQUEST:
    case UPDATE_ADDRESS_REQUEST:
      return { ...state, isLoading: true, error: null };
    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          addresses: action.payload.isDefault
            ? [
                ...(state.user?.addresses || []).map((addr) => ({
                  ...addr,
                  isDefault: false,
                })),
                action.payload,
              ]
            : [...(state.user?.addresses || []), action.payload],
        },
      };
    case GET_USER_ADDRESSES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          addresses: action.payload,
        },
      };
    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(
            (address) => address._id !== action.payload
          ),
        },
      };
    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          addresses: action.payload.isDefault
            ? state.user.addresses.map((address) =>
                address._id === action.payload._id
                  ? action.payload
                  : { ...address, isDefault: false }
              )
            : state.user.addresses.map((address) =>
                address._id === action.payload._id ? action.payload : address
              ),
        },
      };
    case ADD_TO_WISHLIST_SUCCESS:
    case REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          wishlist: action.payload, // Payload is the updated wishlist array (of IDs or Objects depending on population)
        },
      };
    case GET_WISHLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...state.user,
          wishlist: action.payload,
        },
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload,
      };
    case ADD_TO_WISHLIST_FAILURE:
    case REMOVE_FROM_WISHLIST_FAILURE:
    case GET_WISHLIST_FAILURE:
    case GET_USER_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case ADD_TO_WISHLIST_REQUEST:
    case REMOVE_FROM_WISHLIST_REQUEST:
    case GET_WISHLIST_REQUEST:
    case GET_USER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGOUT:
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};