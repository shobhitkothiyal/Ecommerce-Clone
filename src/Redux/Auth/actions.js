import axios from "axios";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  LOGOUT,
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
// Ideally base URL should be in env or config
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, userData);
    const { jwt_token, message } = response.data; // Backend returns jwt_token
    if (jwt_token) {
      localStorage.setItem("jwt", jwt_token);
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: jwt_token, user: null },
    }); // User data might need fetching separately or decoding token
    return response.data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const signup = (userData) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    const { jwt, message } = response.data; // Backend returns jwt
    if (jwt) {
      localStorage.setItem("jwt", jwt);
    }
    dispatch({ type: SIGNUP_SUCCESS, payload: { token: jwt, user: null } });
    return response.data;
  } catch (error) {
    dispatch({
      type: SIGNUP_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};

export const addAddress = (addressData) => async (dispatch) => {
  dispatch({ type: ADD_ADDRESS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: ADD_ADDRESS_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.post(
      `${API_BASE_URL}/user/addresses`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: ADD_ADDRESS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: ADD_ADDRESS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const getUserAddresses = () => async (dispatch) => {
  dispatch({ type: GET_USER_ADDRESSES_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: GET_USER_ADDRESSES_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.get(`${API_BASE_URL}/user/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_USER_ADDRESSES_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: GET_USER_ADDRESSES_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const deleteAddress = (addressId) => async (dispatch) => {
  dispatch({ type: DELETE_ADDRESS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: DELETE_ADDRESS_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    await axios.delete(`${API_BASE_URL}/user/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: addressId });
  } catch (error) {
    dispatch({
      type: DELETE_ADDRESS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const updateAddress = (addressId, addressData) => async (dispatch) => {
  dispatch({ type: UPDATE_ADDRESS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.put(
      `${API_BASE_URL}/user/addresses/${addressId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: UPDATE_ADDRESS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const addItemToWishlist = (productId) => async (dispatch) => {
  dispatch({ type: ADD_TO_WISHLIST_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: ADD_TO_WISHLIST_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.put(
      `${API_BASE_URL}/user/wishlist/add`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: ADD_TO_WISHLIST_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: ADD_TO_WISHLIST_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const removeItemFromWishlist = (productId) => async (dispatch) => {
  dispatch({ type: REMOVE_FROM_WISHLIST_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: REMOVE_FROM_WISHLIST_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.put(
      `${API_BASE_URL}/user/wishlist/remove`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: REMOVE_FROM_WISHLIST_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_WISHLIST_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const getUserWishlist = () => async (dispatch) => {
  dispatch({ type: GET_WISHLIST_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: GET_WISHLIST_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.get(`${API_BASE_URL}/user/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_WISHLIST_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: GET_WISHLIST_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

export const getUser = (token) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    if (!token) {
      dispatch({ type: GET_USER_FAILURE, payload: "Authentication token is missing" });
      return;
    }
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwt");
      dispatch({ type: LOGOUT });
    }
    dispatch({
      type: GET_USER_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};