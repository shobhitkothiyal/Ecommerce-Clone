import axios from "axios";
import {
  CREATE_REVIEW_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  GET_ALL_REVIEWS_FAILURE,
  GET_ALL_REVIEWS_REQUEST,
  GET_ALL_REVIEWS_SUCCESS,
} from "./ActionType";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export const createReview = (resData) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const { data } = await axios.post(
      `${API_BASE_URL}/reviews/create`,
      resData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure multipart for file upload
        },
      },
    );
    dispatch({
      type: CREATE_REVIEW_SUCCESS,
      payload: data,
    });
    console.log("create review success ", data);
    return true; // Indicate success
  } catch (error) {
    dispatch({
      type: CREATE_REVIEW_FAILURE,
      payload: error.message,
    });
    return false; // Indicate failure
  }
};

export const getAllReviews = (productId) => async (dispatch) => {
  dispatch({ type: GET_ALL_REVIEWS_REQUEST });
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/reviews/product/${productId}`,
    );
    dispatch({
      type: GET_ALL_REVIEWS_SUCCESS,
      payload: data,
    });
    console.log("get all reviews success ", data);
  } catch (error) {
    dispatch({
      type: GET_ALL_REVIEWS_FAILURE,
      payload: error.message,
    });
  }
};