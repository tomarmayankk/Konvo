import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("konvo_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // AUTO-LOGOUT on 401 — session expired or cookie missing
    if (status === 401) {
      // Avoid redirect loop if the 401 came from auth routes themselves
      const isAuthRoute = originalRequest.url?.includes("/auth/");

      if (!isAuthRoute) {
        // Dynamically import to avoid circular dependency
        const { default: useAuthStore } = await import("../store/useAuthStore");
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }

    // DON'T RETRY on 403, 404, 4xx — these are client errors, not transient
    if (status >= 400 && status < 500) {
      return Promise.reject(error);
    }

    // RETRY ONCE on 5xx or network failure
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default API;
