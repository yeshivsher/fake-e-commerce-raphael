import axios from "axios";
import { handleAPIError } from "../utils/errorUtils";

const API_BASE_URL = "https://fakestoreapi.com";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Real authentication endpoints using Fake Store API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, "Login failed. Please try again."));
    }
  },

  register: async (userData) => {
    try {
      // FakeStore API uses /users endpoint for registration
      const response = await api.post("/users", userData);
      return response;
    } catch (error) {
      throw new Error(
        handleAPIError(error, "Registration failed. Please try again.")
      );
    }
  },

  getUser: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      const user = response.data;
      return {
        data: {
          id: user.id,
          username: user.username,
          firstname: user.name?.firstname || "",
          lastname: user.name?.lastname || "",
          email: user.email
        }
      };
    } catch (error) {
      throw new Error(handleAPIError(error, "Failed to get user data"));
    }
  }
};

// Product endpoints
export const productsAPI = {
  getAll: () => api.get("/products"),
  getCategories: () => api.get("/products/categories"),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getProduct: (id) => api.get(`/products/${id}`)
};

export default api;
