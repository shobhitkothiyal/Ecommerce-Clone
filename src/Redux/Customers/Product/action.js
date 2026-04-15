import axios from "axios";
import {
  FIND_PRODUCTS_FAILURE,
  FIND_PRODUCTS_REQUEST,
  FIND_PRODUCTS_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
} from "./actionType";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const findProducts = (reqQuery) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCTS_REQUEST });
  const {
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    stock,
    sort,
    pageNumber,
    pageSize,
  } = reqQuery;

  try {
    // Construct query string
    const params = new URLSearchParams();
    if (colors && colors.length > 0) params.append("colors", colors);
    if (sizes && sizes.length > 0) params.append("sizes", sizes);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (minDiscount) params.append("minDiscount", minDiscount);
    if (category) params.append("category", category);
    if (stock) params.append("stock", stock);
    if (sort) params.append("sort", sort);
    if (pageNumber) params.append("pageNumber", pageNumber);
    if (pageSize) params.append("pageSize", pageSize);

    const { data } = await api.get(`/products?${params.toString()}`);

    dispatch({ type: FIND_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
  const { productId } = reqData;
  try {
    const { data } = await api.get(`/products/${productId}`);
    dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload: error.message });
  }
};