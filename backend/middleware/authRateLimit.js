import rateLimit from 'express-rate-limit'
import AuditLog from '../models/AuditLog.js'

// Store failed attempts in memory (in production, use Redis)
const failedAttempts = new Map()

// Clean up old attempts periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of failedAttempts.entries()) {
    if (data.timestamp < now - 15 * 60 * 1000) { // 15 minutes
      failedAttempts.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean every 5 minutes

// Get client identifier
const getClientId = (req) => {
  return req.ip || req.connection.remoteAddress || req.socket.remoteAddress
}

// Check if IP is blocked due to too many failed attempts
const isBlocked = (clientId) => {
  const attempts = failedAttempts.get(clientId)
  if (!attempts) return false

  const now = Date.now()
  const timeSinceLastAttempt = now - attempts.timestamp

  // Reset if 15 minutes have passed
  if (timeSinceLastAttempt > 15 * 60 * 1000) {
    failedAttempts.delete(clientId)
    return false
  }

  // Block if more than 10 failed attempts
  return attempts.count >= 10
}

// Record failed attempt
const recordFailedAttempt = (clientId) => {
  const attempts = failedAttempts.get(clientId) || { count: 0, timestamp: Date.now() }
  attempts.count += 1
  attempts.timestamp = Date.now()
  failedAttempts.set(clientId, attempts)
}

// Reset failed attempts on successful login
const resetFailedAttempts = (clientId) => {
  failedAttempts.delete(clientId)
}

// General auth rate limiter (moderate)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.logAction({
      action: 'security_breach',
      description: 'Rate limit exceeded for authentication endpoint',
      ipAddress: getClientId(req),
      userAgent: req.headers['user-agent'],
      severity: 'medium',
      status: 'failure',
    })

    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later',
      retryAfter: '15 minutes',
    })
  },
})

// Strict rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.logAction({
      action: 'login_failed',
      description: 'Rate limit exceeded for login endpoint',
      ipAddress: getClientId(req),
      userAgent: req.headers['user-agent'],
      severity: 'high',
      status: 'failure',
    })

    res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later',
      retryAfter: '15 minutes',
    })
  },
})

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.logAction({
      action: 'security_breach',
      description: 'Rate limit exceeded for password reset endpoint',
      ipAddress: getClientId(req),
      userAgent: req.headers['user-agent'],
      severity: 'high',
      status: 'failure',
    })

    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later',
      retryAfter: '1 hour',
    })
  },
})

// Rate limiter for OTP verification
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 OTP attempts per window
  message: {
    success: false,
    message: 'Too many OTP verification attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.logAction({
      action: 'security_breach',
      description: 'Rate limit exceeded for OTP verification endpoint',
      ipAddress: getClientId(req),
      userAgent: req.headers['user-agent'],
      severity: 'medium',
      status: 'failure',
    })

    res.status(429).json({
      success: false,
      message: 'Too many OTP verification attempts, please try again later',
      retryAfter: '15 minutes',
    })
  },
})

// Rate limiter for registration
// export const registrationLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // 3 registration attempts per hour
//   message: {
//     success: false,
//     message: 'Too many registration attempts, please try again later',
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: async (req, res) => {
//     await AuditLog.logAction({
//       action: 'security_breach',
//       description: 'Rate limit exceeded for registration endpoint',
//       ipAddress: getClientId(req),
//       userAgent: req.headers['user-agent'],
//       severity: 'medium',
//       status: 'failure',
//     })

//     res.status(429).json({
//       success: false,
//       message: 'Too many registration attempts, please try again later',
//       retryAfter: '1 hour',
//     })
//   },
// })

export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour

  // Development me unlimited jaisa
  max: process.env.NODE_ENV === "development" ? 1000 : 3,

  message: {
    success: false,
    message: "Too many registration attempts, please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res) => {
    await AuditLog.logAction({
      action: "security_breach",
      description: "Rate limit exceeded for registration endpoint",
      ipAddress: getClientId(req),
      userAgent: req.headers["user-agent"],
      severity: "medium",
      status: "failure",
    });

    return res.status(429).json({
      success: false,
      message: "Too many registration attempts, please try again later",
      retryAfter: "1 hour",
    });
  },
});

// Rate limiter for email verification
export const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 verification attempts per window
  message: {
    success: false,
    message: 'Too many email verification attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.logAction({
      action: 'security_breach',
      description: 'Rate limit exceeded for email verification endpoint',
      ipAddress: getClientId(req),
      userAgent: req.headers['user-agent'],
      severity: 'low',
      status: 'failure',
    })

    res.status(429).json({
      success: false,
      message: 'Too many email verification attempts, please try again later',
      retryAfter: '15 minutes',
    })
  },
})

// Middleware to check IP blocking
export const checkIpBlock = async (req, res, next) => {
  const clientId = getClientId(req)

  if (isBlocked(clientId)) {
    await AuditLog.logAction({
      action: 'security_breach',
      description: 'Blocked IP attempted to access auth endpoint',
      ipAddress: clientId,
      userAgent: req.headers['user-agent'],
      severity: 'critical',
      status: 'failure',
    })

    return res.status(403).json({
      success: false,
      message: 'Your IP has been temporarily blocked due to too many failed attempts',
      retryAfter: '15 minutes',
    })
  }

  next()
}

// Middleware to record failed login attempts
export const recordLoginAttempt = (success) => {
  return async (req, res, next) => {
    const originalSend = res.send
    
    res.send = function(data) {
      const clientId = getClientId(req)
      
      if (success) {
        resetFailedAttempts(clientId)
      } else {
        recordFailedAttempt(clientId)
      }
      
      originalSend.call(this, data)
    }
    
    next()
  }
}

// Export helper functions
export { getClientId, isBlocked, recordFailedAttempt, resetFailedAttempts }
