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

// Mock authentication system since Fake Store API doesn't have auth endpoints
const mockUsers = [
  {
    id: 1,
    email: "john@gmail.com",
    username: "johnd",
    password: "m38rmF$",
    name: {
      firstname: "John",
      lastname: "Doe"
    },
    address: {
      city: "kilcoole",
      street: "new road",
      number: 7682,
      zipcode: "12926-3874",
      geolocation: {
        lat: "-37.3159",
        long: "81.1496"
      }
    },
    phone: "1-570-236-7033"
  },
  {
    id: 2,
    email: "morrison@gmail.com",
    username: "mor_2314",
    password: "83r5^_",
    name: {
      firstname: "david",
      lastname: "morrison"
    },
    address: {
      city: "san Antonio",
      street: "Lovers Ln",
      number: 7267,
      zipcode: "78205",
      geolocation: {
        lat: "-37.3159",
        long: "81.1496"
      }
    },
    phone: "1-570-236-7033"
  }
];

// Auth endpoints (mock implementation)
export const authAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (user) {
      // Create a mock token
      const token = btoa(
        JSON.stringify({ userId: user.id, username: user.username })
      );
      return { data: { token, user } };
    } else {
      throw new Error("Invalid credentials");
    }
  },

  register: async (userData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if username already exists
    const existingUser = mockUsers.find(
      (u) => u.username === userData.username
    );
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData
    };

    mockUsers.push(newUser);

    // Auto-login after registration
    const token = btoa(
      JSON.stringify({ userId: newUser.id, username: newUser.username })
    );
    return { data: { token, user: newUser } };
  },

  getUser: async (userId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = mockUsers.find(
      (u) => u.id === parseInt(userId) || u.username === userId
    );
    if (user) {
      return { data: user };
    } else {
      throw new Error("User not found");
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
