import axios from "axios";

// Configured Axios instance ready for future Node.js backend integration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token when available
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("autoserve_auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error reading auth token", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling global responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session on unauthenticated response if backend is live
      console.warn("Unauthorized API call, redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default api;