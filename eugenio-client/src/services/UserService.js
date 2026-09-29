import axios from "axios";
import constants from "./constants";
// API Access to Front-end JSON data transformation or decoder
const API = axios.create({
  baseURL: `${constants.HOST}/api/v1/users`,
  withCredentials: true,
});

// Fetch users
export const fetchUsers = (user) => API.get("/", user);
// Create user
export const createUser = (user) => API.post("/", user);
// Update user
export const updateUser = (id, user) => API.put(`/${id}`, user);
// Delete user
export const deleteUser = (id) => API.delete(`/${id}`);
// Login user
export const loginUser = (credentials) => API.post("/login", credentials);
export const signupUser = (user) => API.post("/signup", user);
export const logoutUser = () => API.post("/logout");
export const refreshSession = () => API.post("/refresh");
export const fetchCurrentUser = () => API.get("/me");
export const updateCurrentUser = (user) => API.put("/me", user);
