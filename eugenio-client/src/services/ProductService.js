import axios from "axios";
import constants from "./constants";

const API = axios.create({
  baseURL: `${constants.HOST}/api/v1/products`,
  withCredentials: true,
});

export const fetchProducts = (params) => API.get("/", { params });
export const fetchProduct = (id) => API.get(`/${id}`);

const toFormData = (product, imageFile) => {
  const formData = new FormData();
  const ignoredFields = new Set(["id", "_id", "categoryName", "productTitle"]);

  Object.entries(product).forEach(([key, value]) => {
    if (ignoredFields.has(key) || value === undefined || value === null) return;
    if (key === "images" || key === "tags" || key === "imagePublicIds") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  });

  if (imageFile) formData.append("image", imageFile);
  return formData;
};

export const createProduct = (product, imageFile) =>
  API.post("/", toFormData(product, imageFile));
export const updateProduct = (id, product, imageFile) =>
  API.put(`/${id}`, toFormData(product, imageFile));
export const deleteProduct = (id) => API.delete(`/${id}`);
