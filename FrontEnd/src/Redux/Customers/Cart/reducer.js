import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  CLEAR_CART_SUCCESS,
} from "./ActionType";

const initialState = {
  cart: null,
  loading: false,
  error: null,
  cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART_REQUEST:
    case GET_CART_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_ITEM_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: [...state.cartItems, action.payload], // But getCart refreshes this usually
        error: null,
      };

    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.cartItems,
        cart: action.payload,
        error: null,
      };

    case REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // cartItems: state.cartItems.filter((item) => item.id !== action.payload), // If we relied on local update
      };

    case UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // cartItems: state.cartItems.map(item => item.id === action.payload.id ? action.payload : item),
      };

    case ADD_ITEM_TO_CART_FAILURE:
    case GET_CART_FAILURE:
    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
          totalItem: 0,
          totalPrice: 0,
          totalDiscountedPrice: 0,
          discount: 0,
          couponDiscount: 0,
          couponCode: null,
        },
        loading: false,
      };
    case REMOVE_CART_ITEM_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
    case "APPLY_COUPON_FAILURE":
    case "REMOVE_COUPON_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "APPLY_COUPON_REQUEST":
    case "REMOVE_COUPON_REQUEST":
      return { ...state, loading: true, error: null };

    case "APPLY_COUPON_SUCCESS":
    case "REMOVE_COUPON_SUCCESS":
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload.cartItems, // Update items if needed? Usually just cart totals change but safe to sync
        error: null,
      };

    default:
      return state;
  }
};