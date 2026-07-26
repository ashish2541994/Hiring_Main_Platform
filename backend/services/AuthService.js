import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Session from "../models/Session.js";
import AuditLog from "../models/AuditLog.js";
import jwtUtils from "../utils/jwtUtils.js";
import passwordValidator from "../utils/passwordValidator.js";
import otpService from "./otpService.js";
import emailService from "./emailService.js";
import config from "../config/appConfig.js";

class AuthService {
  // Register new user
  async register(userData, deviceInfo = {}) {
    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email: userData.email });
    if (existingUserByEmail) {
      throw new Error("User already exists with this email");
    }

    // Only check username if provided
    if (userData.username) {
      const existingUserByUsername = await User.findOne({
        username: userData.username,
      });
      if (existingUserByUsername) {
        throw new Error("Username already taken");
      }
    }

    // Validate password
    const passwordValidation = passwordValidator.validate(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // ALWAYS force role to "candidate" on registration — ignore any role from frontend.
    // Recruiters can be created only via Admin panel.
    // Admin can ONLY be created manually in MongoDB.
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: "candidate",
      companyId: undefined, // candidates don't have a company
    });

    // Generate OTP for email verification
    await otpService.createOTP(user.email, "email_verification");

    // Log registration
    await AuditLog.logAction({
      userId: user._id,
      action: "profile_update",
      entityType: "user",
      entityId: user._id,
      description: "User registered successfully",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      deviceInfo: deviceInfo.deviceInfo,
      status: "success",
    });

    // Generate tokens for auto-login after registration
    const tokens = jwtUtils.generateTokenPair(user);

    // Store refresh token in database
    const refreshTokenExpiry = new Date(
      Date.now() + tokens.refreshTokenExpiresIn,
    );
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
    });

    // Create session
    const sessionExpiry = new Date(Date.now() + tokens.accessTokenExpiresIn);
    const session = await Session.create({
      userId: user._id,
      token: tokens.accessToken,
      expiresAt: sessionExpiry,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresIn: tokens.accessTokenExpiresIn,
      sessionId: session._id,
      message: "Registration successful. Please verify your email.",
      requiresVerification: true,
    };
  }

  // Login user
  async login(emailOrUsername, password, deviceInfo = {}) {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) {
      await AuditLog.logAction({
        action: "login_failed",
        description: `Login attempt with non-existent user: ${emailOrUsername}`,
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        status: "failure",
        severity: "low",
      });
      throw new Error("Invalid credentials");
    }

    // Check if account is locked
    if (user.isLocked()) {
      await AuditLog.logAction({
        userId: user._id,
        action: "login_failed",
        description: "Login attempt on locked account",
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        status: "failure",
        severity: "high",
      });
      throw new Error(
        "Account is temporarily locked due to too many failed attempts",
      );
    }

    // Check if account is active
    if (!user.isActive) {
      await AuditLog.logAction({
        userId: user._id,
        action: "login_failed",
        description: "Login attempt on inactive account",
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        status: "failure",
        severity: "medium",
      });
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementFailedLogin();
      await AuditLog.logAction({
        userId: user._id,
        action: "login_failed",
        description: "Invalid password",
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        status: "failure",
        severity: "medium",
      });
      throw new Error("Invalid credentials");
    }

    // Reset failed login attempts
    await user.resetFailedLogin();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair(user);

    // Store refresh token in database
    const refreshTokenExpiry = new Date(
      Date.now() + tokens.refreshTokenExpiresIn,
    );
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
    });

    // Create session
    const sessionExpiry = new Date(Date.now() + tokens.accessTokenExpiresIn);
    const session = await Session.create({
      userId: user._id,
      token: tokens.accessToken,
      expiresAt: sessionExpiry,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
    });

    // Log successful login
    await AuditLog.logAction({
      userId: user._id,
      action: "login",
      entityType: "session",
      entityId: session._id,
      description: "User logged in successfully",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
      status: "success",
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
      sessionId: session._id,
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken, deviceInfo = {}) {
    // Verify refresh token
    const verification = jwtUtils.verifyRefreshToken(refreshToken);
    if (!verification.valid) {
      throw new Error("Invalid or expired refresh token");
    }

    // Check if refresh token exists in database
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || !storedToken.isValid()) {
      throw new Error("Invalid or expired refresh token");
    }

    // Get user
    const user = await User.findById(storedToken.userId);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Generate new tokens
    const tokens = jwtUtils.generateTokenPair(user);

    // Revoke old refresh token
    await storedToken.revoke(tokens.refreshToken);

    // Store new refresh token
    const refreshTokenExpiry = new Date(
      Date.now() + tokens.refreshTokenExpiresIn,
    );
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user._id,
      expiresAt: refreshTokenExpiry,
      deviceInfo: deviceInfo.deviceInfo,
      location: deviceInfo.location,
      replacedBy: storedToken.token,
    });

    // Update session
    const session = await Session.findOne({ userId: user._id, isActive: true });
    if (session) {
      session.token = tokens.accessToken;
      session.lastActive = new Date();
      session.expiresAt = new Date(Date.now() + tokens.accessTokenExpiresIn);
      await session.save();
    }

    // Log token refresh
    await AuditLog.logAction({
      userId: user._id,
      action: "token_refreshed",
      description: "Access token refreshed",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
    });

    return tokens;
  }

  // Logout user
  async logout(userId, sessionId, deviceInfo = {}) {
    // Revoke refresh tokens for this session
    await RefreshToken.updateMany(
      { userId, revoked: false },
      { revoked: true, revokedAt: new Date() },
    );

    // Terminate session
    const session = await Session.findById(sessionId);
    if (session) {
      await session.terminate("user_initiated");
    }

    // Log logout
    await AuditLog.logAction({
      userId,
      action: "logout",
      entityType: "session",
      entityId: sessionId,
      description: "User logged out",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
    });

    return { success: true };
  }

  // Logout from all devices
  async logoutAllDevices(userId, deviceInfo = {}) {
    // Revoke all refresh tokens
    await RefreshToken.updateMany(
      { userId },
      { revoked: true, revokedAt: new Date() },
    );

    // Terminate all sessions
    await Session.updateMany(
      { userId, isActive: true },
      {
        isActive: false,
        logoutTime: new Date(),
        logoutReason: "user_initiated",
      },
    );

    // Log logout from all devices
    await AuditLog.logAction({
      userId,
      action: "logout",
      description: "User logged out from all devices",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
      severity: "medium",
    });

    return { success: true };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword, deviceInfo = {}) {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    const passwordValidation = passwordValidator.validate(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // Check if new password is in history
    const isInHistory = await user.isPasswordInHistory(newPassword);
    if (isInHistory) {
      throw new Error("Cannot reuse a recent password");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens (force re-login)
    await RefreshToken.updateMany(
      { userId },
      { revoked: true, revokedAt: new Date() },
    );

    // Log password change
    await AuditLog.logAction({
      userId,
      action: "password_change",
      entityType: "user",
      entityId: userId,
      description: "User changed password",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
      severity: "medium",
    });

    return { success: true };
  }

  // Request password reset
  async forgotPassword(email, deviceInfo = {}) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return {
        success: true,
        message: "If the email exists, a reset code will be sent",
      };
    }

    // Generate OTP for password reset
    await otpService.createOTP(user.email, "password_reset");

    // Log password reset request
    await AuditLog.logAction({
      userId: user._id,
      action: "password_reset_requested",
      entityType: "user",
      entityId: user._id,
      description: "User requested password reset",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
      severity: "medium",
    });

    return {
      success: true,
      message: "If the email exists, a reset code will be sent",
    };
  }

  // Reset password with OTP
  async resetPasswordWithOTP(email, otp, newPassword, deviceInfo = {}) {
    // Verify OTP
    const otpVerification = await otpService.verifyOTP(
      email,
      otp,
      "password_reset",
    );
    if (!otpVerification.success) {
      throw new Error(otpVerification.message);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Validate new password
    const passwordValidation = passwordValidator.validate(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // Check if new password is in history
    const isInHistory = await user.isPasswordInHistory(newPassword);
    if (isInHistory) {
      throw new Error("Cannot reuse a recent password");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens
    await RefreshToken.updateMany(
      { userId: user._id },
      { revoked: true, revokedAt: new Date() },
    );

    // Terminate all sessions
    await Session.updateMany(
      { userId: user._id },
      {
        isActive: false,
        logoutTime: new Date(),
        logoutReason: "security_breach",
      },
    );

    // Log password reset
    await AuditLog.logAction({
      userId: user._id,
      action: "password_reset_completed",
      entityType: "user",
      entityId: user._id,
      description: "User reset password with OTP",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
      severity: "high",
    });

    return { success: true };
  }

  // Verify email with OTP
  async verifyEmail(email, otp, deviceInfo = {}) {
    // Verify OTP
    const otpVerification = await otpService.verifyOTP(
      email,
      otp,
      "email_verification",
    );
    if (!otpVerification.success) {
      throw new Error(otpVerification.message);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Update email verification status
    user.emailVerified = true;
    user.isVerified = true;
    await user.save();

    // Log email verification
    await AuditLog.logAction({
      userId: user._id,
      action: "email_verification",
      entityType: "user",
      entityId: user._id,
      description: "User verified email",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
    });

    return { success: true };
  }

  // Resend verification OTP
  async resendVerificationOTP(email, deviceInfo = {}) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      throw new Error("Email already verified");
    }

    // Resend OTP
    await otpService.resendOTP(email, "email_verification");

    // Log resend
    await AuditLog.logAction({
      userId: user._id,
      action: "email_verification",
      description: "User requested new verification OTP",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "pending",
    });

    return { success: true };
  }

  // Get user sessions
  async getUserSessions(userId) {
    const sessions = await Session.find({ userId })
      .sort({ lastActive: -1 })
      .limit(10);

    return sessions.map((session) => session.getSessionInfo());
  }

  // Terminate specific session
  async terminateSession(userId, sessionId, deviceInfo = {}) {
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new Error("Session not found");
    }

    await session.terminate("user_initiated");

    // Log session termination
    await AuditLog.logAction({
      userId,
      action: "session_terminated",
      entityType: "session",
      entityId: sessionId,
      description: "User terminated a session",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
    });

    return { success: true };
  }

  // Sanitize user object (remove sensitive data)
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.passwordHistory;
    delete userObj.refreshToken;
    delete userObj.failedLoginAttempts;
    delete userObj.lockUntil;
    return userObj;
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.sanitizeUser(user);
  }

  // Update user profile
  async updateProfile(userId, profileData, deviceInfo = {}) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "username",
      "phone",
      "location",
      "bio",
      "skills",
      "education",
      "languages",
      "socialLinks",
      "currentCompany",
      "currentDesignation",
      "yearsOfExperience",
      "expectedSalary",
      "preferredJobType",
      "preferredLocation",
      "availability",
      "professionalSummary",
      "gender",
      "dateOfBirth",
      "nationality",
      "preferredLanguage",
    ];

    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        user[field] = profileData[field];
      }
    });

    await user.save();

    // Log profile update
    await AuditLog.logAction({
      userId,
      action: "profile_update",
      entityType: "user",
      entityId: userId,
      description: "User updated profile",
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      status: "success",
    });

    return {
      user: this.sanitizeUser(user),
      profileCompletion: user.getProfileCompletion(),
      missingFields: user.getMissingProfileFields(),
    };
  }
}

export default new AuthService();
