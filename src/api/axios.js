import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://brew-break-backend.test/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically if logged in
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
