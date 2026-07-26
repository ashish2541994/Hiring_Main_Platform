// Application Configuration
// Centralized configuration for development/production feature flags

const isDevelopment = process.env.NODE_ENV !== 'production';

export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment,
  isProduction: !isDevelopment,

  // Authentication Configuration
  auth: {
    // Password requirements
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
      maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH) || 128,
      requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
      requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
      requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
      requireSpecialChar: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
      preventReuse: parseInt(process.env.PASSWORD_HISTORY_COUNT) || 5,
    },
    // Account lockout
    lockout: {
      maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
      lockDuration: parseInt(process.env.LOCKOUT_DURATION) || 15 * 60 * 1000, // 15 minutes
    },
    // Session management
    session: {
      maxSessions: parseInt(process.env.MAX_SESSIONS) || 10,
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
      rememberMeDuration: parseInt(process.env.REMEMBER_ME_DURATION) || 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    // Token settings
    token: {
      accessTokenExpiry: process.env.JWT_EXPIRE || '7d',
      refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRE || '30d',
    },
  },

  // OTP Configuration
  otp: {
    useConsoleOTP: process.env.USE_CONSOLE_OTP === 'true' || isDevelopment,
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES) || 10,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 3,
    length: parseInt(process.env.OTP_LENGTH) || 6,
    resendCooldown: parseInt(process.env.OTP_RESEND_COOLDOWN) || 60, // seconds
  },

  // Storage Configuration
  storage: {
    useLocalStorage: process.env.USE_LOCAL_STORAGE === 'true' || isDevelopment,
    useCloudinary: process.env.USE_CLOUDINARY === 'true' && !isDevelopment,
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // Email Configuration
  email: {
    useSMTP: process.env.USE_SMTP === 'true' && !isDevelopment,
    useConsole: process.env.USE_CONSOLE_EMAIL !== 'false' && isDevelopment,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@windhire.com',
    },
  },

  // Upload Directories
  uploadDirs: {
    avatars: 'uploads/avatars',
    companies: 'uploads/companies',
    jobs: 'uploads/jobs',
    gallery: 'uploads/gallery',
    resumes: 'uploads/resumes',
    documents: 'uploads/documents',
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 5000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'wind-hire-secret-key-development-only-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'wind-hire-refresh-secret-key-development-only-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Security Configuration
  security: {
    enableHelmet: process.env.DISABLE_HELMET !== 'true',
    enableCors: process.env.DISABLE_CORS !== 'true',
    enableCompression: process.env.DISABLE_COMPRESSION !== 'true',
    enableRateLimit: process.env.DISABLE_RATE_LIMIT !== 'true',
    enableAuditLog: process.env.DISABLE_AUDIT_LOG !== 'true',
  },

  // Audit Log Configuration
  auditLog: {
    retentionDays: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 365,
    logLevel: process.env.AUDIT_LOG_LEVEL || 'all', // all, security, critical
  },
};

export default config;
