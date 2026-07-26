import express from 'express'
import {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationOTP,
  getCurrentUser,
  getSessions,
  terminateSession,
  updateProfile,
  validatePassword,
  checkAuthStatus,
} from '../controllers/authController.js'
import { authenticate } from '../middleware/permissions.js'
import {
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  otpLimiter,
  registrationLimiter,
  emailVerificationLimiter,
  checkIpBlock,
} from '../middleware/authRateLimit.js'

const router = express.Router()

// Public routes with rate limiting
router.post('/register', registrationLimiter, checkIpBlock, register)
router.post('/login', loginLimiter, checkIpBlock, login)
router.post('/refresh-token', authLimiter, refreshToken)
router.post('/forgot-password', passwordResetLimiter, forgotPassword)
router.post('/reset-password', passwordResetLimiter, resetPassword)
router.post('/verify-email', otpLimiter, verifyEmail)
router.post('/resend-verification', emailVerificationLimiter, resendVerificationOTP)
router.post('/validate-password', authLimiter, validatePassword)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
router.get('/check-status', authenticate, checkAuthStatus)
router.post('/logout', authenticate, logout)
router.post('/logout-all', authenticate, logoutAll)
router.put('/change-password', authenticate, changePassword)
router.get('/sessions', authenticate, getSessions)
router.delete('/sessions/:sessionId', authenticate, terminateSession)
router.put('/profile', authenticate, updateProfile)

export default router
