import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  LOGOUT,
} from "./ActionTypes";

const initialState = {
  user: null,
  userList: [], // always an array for mapping in components
  isLoading: false,
  error: null,
  currentPage: 1, // pagination state
  totalPages: 1,
  jwt: localStorage.getItem("jwt") || null, // Initialize JWT
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case GET_ALL_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jwt: action.payload.jwt, // Update JWT on login success
        error: null,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case GET_ALL_USERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };

    case GET_ALL_USERS_SUCCESS: {
      // Normalize payload: support either an array or an object wrapper
      const payload = action.payload;

      // If payload is an object with `users` array (and pagination), use that
      if (
        payload &&
        typeof payload === "object" &&
        !Array.isArray(payload) &&
        Array.isArray(payload.users)
      ) {
        return {
          ...state,
          isLoading: false,
          userList: payload.users,
          currentPage: payload.currentPage || state.currentPage || 1,
          totalPages: payload.totalPages || state.totalPages || 1,
        };
      }

      // If payload is an array, treat it as the user list
      if (Array.isArray(payload)) {
        return {
          ...state,
          isLoading: false,
          userList: payload,
          // keep existing pagination values or reset to defaults
          currentPage: state.currentPage || 1,
          totalPages: state.totalPages || 1,
        };
      }

      // Fallback — unknown shape
      return {
        ...state,
        isLoading: false,
        userList: [],
      };
    }

    case LOGOUT:
      localStorage.removeItem("jwt");
      return {
        ...state,
        jwt: null,
        user: null,
      };

    default:
      return state;
  }
};

export default authReducer;