import axios from "axios";
import constants from "./constants";

const API = axios.create({
  baseURL: `${constants.HOST}/api/v1/categories`,
  withCredentials: true,
});

export const fetchCategories = () => API.get("/");
