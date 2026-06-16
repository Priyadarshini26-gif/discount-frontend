import axios from "axios";

const API = axios.create({
  baseURL: "https://crs-backend-o2de.onrender.com",
  withCredentials: true
});

export default API;