import axios from "axios";

import { clearAccessToken, getAccessToken } from "../utils/auth";

const api = axios.create({
  // Flask's local development host listens on IPv4. Use the IPv4 loopback
  // explicitly so browsers do not resolve localhost to an unavailable ::1 socket.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
    }
    return Promise.reject(error);
  },
);

export default api;
