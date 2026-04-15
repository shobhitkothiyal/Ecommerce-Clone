import axios from "axios";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_USER_ORDERS_FAILURE,
  GET_USER_ORDERS_REQUEST,
  GET_USER_ORDERS_SUCCESS,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  RETURN_ORDER_REQUEST,
  RETURN_ORDER_SUCCESS,
  RETURN_ORDER_FAILURE,
} from "./ActionType";
// import { API_BASE_URL } from "../../../config/apiConfig";
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/orders/`,
      reqData.address,
    );
    if (data._id) {
      reqData.navigate({ search: `step=3&order_id=${data._id}` });
    }
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.message,
    });
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: error.message,
    });
  }
};

export const getUserOrders = () => async (dispatch) => {
  dispatch({ type: GET_USER_ORDERS_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}/orders/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({
      type: GET_USER_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ORDERS_FAILURE,
      payload: error.message,
    });
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CANCEL_ORDER_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    dispatch({
      type: CANCEL_ORDER_SUCCESS,
      payload: data,
    });
    dispatch(getOrderById(orderId));
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAILURE,
      payload: error.message,
    });
  }
};

export const returnOrder = (orderId, reqData) => async (dispatch) => {
  dispatch({ type: RETURN_ORDER_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/return`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    dispatch({
      type: RETURN_ORDER_SUCCESS,
      payload: data,
    });
    dispatch(getOrderById(orderId));
  } catch (error) {
    dispatch({
      type: RETURN_ORDER_FAILURE,
      payload: error.message,
    });
  }
};