import axois from "axios";
console.log(import.meta.mode);
const axiosInstance = axois.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export default axiosInstance;
