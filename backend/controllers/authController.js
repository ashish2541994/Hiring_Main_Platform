import authService from "../services/AuthService.js";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  emailVerificationValidation,
  resendOTPValidation,
} from "../utils/validationSchemas.js";
import {
  handleFirstValidationError,
  handleValidationErrors,
} from "../middleware/validationHandler.js";

// Helper to extract device info from request
const extractDeviceInfo = (req) => ({
  ip: req.ip || req.connection.remoteAddress,
  userAgent: req.headers["user-agent"],
  deviceInfo: {
    userAgent: req.headers["user-agent"],
    browser: req.headers["user-agent"]?.split(" ")[0] || "unknown",
    os: "unknown", // Would need user-agent parsing library
    device: "unknown", // Would need user-agent parsing library
  },
  location: {
    ip: req.ip,
    country: req.headers["cf-ipcountry"] || null, // Cloudflare header
    city: null, // Would need IP geolocation service
  },
});

// Register new user
export const register = [
  ...registerValidation,
  handleFirstValidationError,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      // Strip role from body — backend forces "candidate"
      delete req.body.role;
      delete req.body.companyId;
      const result = await authService.register(req.body, deviceInfo);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error.code === 11000
          ? "Email already exists"
          : error.message || "Registration failed";
      res.status(400).json({
        success: false,
        message,
      });
    }
  },
];

// Login user
export const login = [
  ...loginValidation,
  handleFirstValidationError,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const result = await authService.login(
        req.body.emailOrUsername,
        req.body.password,
        deviceInfo,
      );

      // Set HTTP-only cookie for refresh token
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpiresIn: result.accessTokenExpiresIn,
        sessionId: result.sessionId,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const deviceInfo = extractDeviceInfo(req);
    const tokens = await authService.refreshAccessToken(
      refreshToken,
      deviceInfo,
    );

    // Update HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      accessTokenExpiresIn: tokens.accessTokenExpiresIn,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const deviceInfo = extractDeviceInfo(req);
    const userId = req.user?.userId || req.user?._id;
    const sessionId = req.body.sessionId || req.user?.sessionId;
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
      // Revoke the specific refresh token from the request body
      const RefreshToken = (await import("../models/RefreshToken.js")).default;
      const storedToken = await RefreshToken.findOne({ token: refreshToken });
      if (storedToken) {
        await storedToken.revoke();
      }
    }

    if (userId) {
      await authService.logout(userId, sessionId, deviceInfo);
    }

    // Clear HTTP-only cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout from all devices
export const logoutAll = async (req, res) => {
  try {
    const deviceInfo = extractDeviceInfo(req);
    const userId = req.user?.userId;

    await authService.logoutAllDevices(userId, deviceInfo);

    // Clear HTTP-only cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Change password
export const changePassword = [
  ...changePasswordValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const userId = req.user?.userId;

      const result = await authService.changePassword(
        userId,
        req.body.currentPassword,
        req.body.newPassword,
        deviceInfo,
      );

      res.status(200).json({
        success: true,
        ...result,
        message: "Password changed successfully. Please login again.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Request password reset
export const forgotPassword = [
  ...forgotPasswordValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const result = await authService.forgotPassword(
        req.body.email,
        deviceInfo,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Reset password with OTP
export const resetPassword = [
  ...resetPasswordValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const result = await authService.resetPasswordWithOTP(
        req.body.email,
        req.body.otp,
        req.body.newPassword,
        deviceInfo,
      );

      res.status(200).json({
        success: true,
        ...result,
        message:
          "Password reset successfully. Please login with your new password.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Verify email with OTP
export const verifyEmail = [
  ...emailVerificationValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const result = await authService.verifyEmail(
        req.body.email,
        req.body.otp,
        deviceInfo,
      );

      res.status(200).json({
        success: true,
        ...result,
        message: "Email verified successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Resend verification OTP
export const resendVerificationOTP = [
  ...resendOTPValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deviceInfo = extractDeviceInfo(req);
      const result = await authService.resendVerificationOTP(
        req.body.email,
        deviceInfo,
      );

      res.status(200).json({
        success: true,
        ...result,
        message: "Verification OTP sent successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
];

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    const user = await authService.getUserById(userId);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user sessions
export const getSessions = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const sessions = await authService.getUserSessions(userId);

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Terminate specific session
export const terminateSession = async (req, res) => {
  try {
    const deviceInfo = extractDeviceInfo(req);
    const userId = req.user?.userId;
    const sessionId = req.params.sessionId;

    const result = await authService.terminateSession(
      userId,
      sessionId,
      deviceInfo,
    );

    res.status(200).json({
      success: true,
      ...result,
      message: "Session terminated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const deviceInfo = extractDeviceInfo(req);
    const userId = req.user?.userId;

    const result = await authService.updateProfile(
      userId,
      req.body,
      deviceInfo,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Validate password strength
export const validatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const validation = passwordValidator.validate(password);

    res.status(200).json({
      success: true,
      ...validation,
      strengthLabel: passwordValidator.getStrengthLabel(validation.strength),
      strengthColor: passwordValidator.getStrengthColor(validation.strength),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Check auth status
export const checkAuthStatus = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        authenticated: false,
      });
    }

    const user = await authService.getUserById(userId);

    res.status(200).json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      authenticated: false,
      message: error.message,
    });
  }
};
