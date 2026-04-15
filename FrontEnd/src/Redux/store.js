import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/reducer";
import { customerProductReducer } from "./Customers/Product/reducer";
import { orderReducer } from "./Customers/Order/Reducer.js";
import { couponReducer } from "./Customers/Coupon/Reducer.js";
import { reviewReducer } from "./Customers/Review/Reducer.js";
import { cartReducer} from "./Customers/Cart/reducer.js";

export const rootReducer = combineReducers({
  auth: authReducer,
  product: customerProductReducer,
  cart: cartReducer,
  order: orderReducer,
  coupon: couponReducer,
  review: reviewReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));