import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // Don't set content-type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if already retried or no response
    if (originalRequest._retry || !error.response) {
      return Promise.reject(error);
    }

    // Only handle 401 Unauthorized errors
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Skip auth endpoints to avoid infinite loops
    const skipPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh-token",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
      "/auth/resend-verification",
    ];
    if (skipPaths.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        "/api/auth/refresh-token",
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      const { accessToken } = response.data;

      // Save new access token (support both keys for compatibility)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("accessToken", accessToken);

      // Update authorization header
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Silently clear tokens on refresh failure — don't dispatch auth:logout
      // which causes race-condition logouts. AuthContext will handle re-auth
      // via checkAuth on next navigation.
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // Remove these silently — let AuthContext decide if user is logged out
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
