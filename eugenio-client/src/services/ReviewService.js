import axios from "axios";
import constants from "./constants";

const API = axios.create({
  baseURL: `${constants.HOST}/api/v1/reviews`,
  withCredentials: true,
});
export const fetchReviews = (params) => API.get("/", { params });
export const createReview = (review) => API.post("/", review);
export const updateReview = (id, review) => API.put(`/${id}`, review);
