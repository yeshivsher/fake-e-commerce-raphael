import axios from "axios";

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
      // Handle API errors
      if (error.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request data");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      // Handle API errors
      if (error.response?.status === 409) {
        throw new Error("Username already exists");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid registration data");
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    }
  },

  getUser: async (userId) => {
    try {
      // Since Fake Store API doesn't have a specific user endpoint,
      // we'll use the login endpoint to get user data
      // This is a workaround since the API doesn't provide user profile endpoints
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Decode JWT token (split by '.' and decode payload)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      // Add padding if needed for base64 decoding
      let base64Payload = tokenParts[1];
      while (base64Payload.length % 4) {
        base64Payload += '=';
      }
      
      const payload = JSON.parse(atob(base64Payload));

      // Return user data from JWT payload
      return {
        data: {
          id: payload.sub, // JWT standard uses 'sub' for user ID
          username: payload.user
        }
      };
    } catch (error) {
      throw new Error("Failed to get user data");
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
