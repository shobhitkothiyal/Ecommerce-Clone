import {
  GET_ALL_COUPONS_FAILURE,
  GET_ALL_COUPONS_REQUEST,
  GET_ALL_COUPONS_SUCCESS,
} from "./ActionType";

const initialState = {
  coupons: [],
  loading: false,
  error: null,
};

export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_COUPONS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_COUPONS_SUCCESS:
      return { ...state, loading: false, coupons: action.payload, error: null };
    case GET_ALL_COUPONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};