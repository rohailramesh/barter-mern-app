import axois from "axios";
const axiosInstance = axois.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:50001" : "/api",
  withCredentials: true,
});

export default axiosInstance;
