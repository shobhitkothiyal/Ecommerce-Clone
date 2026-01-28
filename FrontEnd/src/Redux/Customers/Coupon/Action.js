import axios from "axios";
import {
  GET_ALL_COUPONS_FAILURE,
  GET_ALL_COUPONS_REQUEST,
  GET_ALL_COUPONS_SUCCESS,
} from "./ActionType";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export const getAllCoupons = () => async (dispatch) => {
  dispatch({ type: GET_ALL_COUPONS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${API_BASE_URL}/coupons/all_coupon`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Coupons response:", response.data);
    dispatch({ type: GET_ALL_COUPONS_SUCCESS, payload: response.data.coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    dispatch({
      type: GET_ALL_COUPONS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};