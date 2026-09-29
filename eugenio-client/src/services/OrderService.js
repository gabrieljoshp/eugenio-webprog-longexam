import axios from "axios";
import constants from "./constants";

const API = axios.create({
  baseURL: `${constants.HOST}/api/v1/orders`,
  withCredentials: true,
});
export const fetchOrders = () => API.get("/");
export const createOrder = (order) => API.post("/", order);
export const updateOrder = (id, order) => API.put(`/${id}`, order);
