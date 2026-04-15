import {
  CREATE_REVIEW_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  GET_ALL_REVIEWS_FAILURE,
  GET_ALL_REVIEWS_REQUEST,
  GET_ALL_REVIEWS_SUCCESS,
} from "./ActionType";

const initialState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW_REQUEST:
    case GET_ALL_REVIEWS_REQUEST:
      return { ...state, isLoading: true, error: null };
    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reviews: [...state.reviews, action.payload],
        error: null,
      };
    case GET_ALL_REVIEWS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reviews: action.payload,
        error: null,
      };
    case CREATE_REVIEW_FAILURE:
    case GET_ALL_REVIEWS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};