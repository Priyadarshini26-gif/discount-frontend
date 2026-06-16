import axios from "axios";

const API = axios.create({
  baseURL: "https://discount-backend-sjs2.onrender.com",
  withCredentials: true
});

export default API;