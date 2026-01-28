import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/reducer";
import { customerProductReducer } from "./Customers/Product/reducer";

import { cartReducer } from "./Customers/Cart/Reducer";
import { orderReducer } from "./Customers/Order/Reducer";
import { couponReducer } from "./Customers/Coupon/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  product: customerProductReducer,
  cart: cartReducer,
  order: orderReducer,
  coupon: couponReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));