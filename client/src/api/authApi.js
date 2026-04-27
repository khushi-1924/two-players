import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const signupUser = (data) => API.post("/auth/signup", data);

export const loginUser = (data) => API.post("/auth/login", data);