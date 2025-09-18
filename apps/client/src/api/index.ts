import axios from "axios";

export const publicHttp = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateHttp = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
