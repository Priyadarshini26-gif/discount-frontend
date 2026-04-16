import axios from "axios";

const API = axios.create({
  baseURL: "https://discount-backend-1.onrender.com",
  withCredentials: true
});

export default API;