import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../config/appConfig.js'

class JWTUtils {
  constructor() {
    this.accessTokenSecret = config.jwt.secret
    this.refreshTokenSecret = config.jwt.refreshSecret
    this.accessTokenExpiry = config.jwt.expiresIn
    this.refreshTokenExpiry = config.jwt.refreshExpiresIn
  }

  // Generate access token
  generateAccessToken(payload) {
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'access',
      },
      this.accessTokenSecret,
      {
        expiresIn: this.accessTokenExpiry,
        issuer: 'windhire',
        audience: 'windhire-users',
      }
    )
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    const token = jwt.sign(
      {
        userId: payload.userId,
        type: 'refresh',
        tokenId: crypto.randomBytes(32).toString('hex'),
      },
      this.refreshTokenSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'windhire',
        audience: 'windhire-refresh',
      }
    )
    return token
  }

  // Generate both tokens
  generateTokenPair(user) {
    const accessToken = this.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    const refreshToken = this.generateRefreshToken({
      userId: user._id.toString(),
    })

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.getExpirationTime(this.accessTokenExpiry),
      refreshTokenExpiresIn: this.getExpirationTime(this.refreshTokenExpiry),
    }
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'windhire',
        audience: 'windhire-users',
      })

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type')
      }

      return {
        valid: true,
        decoded,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'windhire',
        audience: 'windhire-refresh',
      })

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type')
      }

      return {
        valid: true,
        decoded,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  // Decode token without verification (for getting expiration, etc.)
  decodeToken(token) {
    try {
      const decoded = jwt.decode(token)
      return decoded
    } catch (error) {
      return null
    }
  }

  // Get expiration time in milliseconds
  getExpirationTime(expiryString) {
    const match = expiryString.match(/(\d+)([dhms])/)
    if (!match) return 7 * 24 * 60 * 60 * 1000 // Default 7 days

    const value = parseInt(match[1])
    const unit = match[2]

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    }

    return value * multipliers[unit]
  }

  // Check if token is expired
  isTokenExpired(token) {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true

    return decoded.exp * 1000 < Date.now()
  }

  // Get time until token expires (in seconds)
  getTimeUntilExpiry(token) {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return 0

    const expiryTime = decoded.exp * 1000
    const currentTime = Date.now()
    const timeUntilExpiry = expiryTime - currentTime

    return Math.max(0, Math.floor(timeUntilExpiry / 1000))
  }

  // Extract user ID from token
  extractUserId(token) {
    const decoded = this.decodeToken(token)
    return decoded?.userId || null
  }

  // Extract role from token
  extractRole(token) {
    const decoded = this.decodeToken(token)
    return decoded?.role || null
  }

  // Generate token for email verification
  generateEmailVerificationToken(userId) {
    return jwt.sign(
      {
        userId,
        type: 'email_verification',
      },
      this.accessTokenSecret,
      {
        expiresIn: '1h',
        issuer: 'windhire',
      }
    )
  }

  // Verify email verification token
  verifyEmailVerificationToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'windhire',
      })

      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type')
      }

      return {
        valid: true,
        decoded,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  // Generate password reset token
  generatePasswordResetToken(userId) {
    return jwt.sign(
      {
        userId,
        type: 'password_reset',
        tokenId: crypto.randomBytes(32).toString('hex'),
      },
      this.accessTokenSecret,
      {
        expiresIn: '1h',
        issuer: 'windhire',
      }
    )
  }

  // Verify password reset token
  verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'windhire',
      })

      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type')
      }

      return {
        valid: true,
        decoded,
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }
}

export default new JWTUtils()
