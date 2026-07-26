import api from "./api";

const authApi = {
  // Register new user
  register: (userData) => {
    return api.post("/auth/register", userData);
  },

  // Login user
  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  // Logout user
  logout: () => {
    return api.post("/auth/logout");
  },

  // Refresh access token
  refreshToken: (refreshToken) => {
    return api.post("/auth/refresh-token", { refreshToken });
  },

  // Get current user
  getCurrentUser: () => {
    return api.get("/auth/me");
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put("/auth/profile", profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put("/auth/change-password", passwordData);
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email });
  },

  // Reset password
  resetPassword: (passwordData) => {
    return api.post("/auth/reset-password", passwordData);
  },

  // Verify email
  verifyEmail: (verificationData) => {
    return api.post("/auth/verify-email", verificationData);
  },

  // Resend verification email
  resendVerificationEmail: (email) => {
    return api.post("/auth/resend-verification", { email });
  },

  // Delete account
  deleteAccount: (password) => {
    return api.delete("/auth/account", { data: { password } });
  },
};

export default authApi;
