// import axios from "axios";

// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// export const http = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // IMPORTANT for HttpOnly cookies
// });


import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const http = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
