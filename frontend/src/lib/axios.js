import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;

// import axois from "axios";
// const axiosInstance = axois.create({
//   baseURL: "http://localhost:5001/api",
//   withCredentials: true,
// });

// export default axiosInstance;
