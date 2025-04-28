import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // You can set a baseURL here if needed
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Send cookies with requests
});

// Add a response interceptor to catch 401/403 and redirect to login
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Optionally clear any local storage or user state here
      if (typeof window !== "undefined") {
        // Show a session-expired message across tabs
        import("@/lib/utils/sessionMessage").then(mod => {
          mod.showSessionExpiredMessage();
        });
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
