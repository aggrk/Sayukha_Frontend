import axios from "axios";
import { apiUrl } from "./utils";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
