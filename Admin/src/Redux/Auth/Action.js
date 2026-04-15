import axios from "axios";
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
import api, { API_BASE_URL } from "../../Config/api";

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("registerr :", user);
    dispatch(registerSuccess(user));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

// Admin Login - uses the new /api/admin/auth/login endpoint
export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    // Use the dedicated admin login endpoint
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/auth/login`,
      userData
    );
    const data = response.data;

    if (data.success && data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      console.log("Admin login success:", data.user);
      // User data is already included in the response
      dispatch({ type: GET_USER_SUCCESS, payload: data.user });
    }
    dispatch(loginSuccess(data));
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    dispatch(loginFailure(errorMessage));
  }
};

//  get user from token
export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      // Try admin profile first
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("Admin User:", user);
    } catch (error) {
      // If admin profile fails, user is not an admin
      console.error("Not an admin or token expired");
      dispatch({ type: GET_USER_FAILURE, payload: "Not authorized as admin" });
    }
  };
};

export const allUser = (page = 1, limit = 10) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${API_BASE_URL}/api/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { users, totalPages, currentPage } = response.data;

      dispatch({
        type: GET_ALL_USERS_SUCCESS,
        payload: { users, totalPages, currentPage },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      dispatch({ type: GET_ALL_USERS_FAILURE, payload: errorMessage });
    }
  };
};

export const logout = (token) => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
  };
};