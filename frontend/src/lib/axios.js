import axois from "axios";
const axiosInstance = axois.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export default axiosInstance;
