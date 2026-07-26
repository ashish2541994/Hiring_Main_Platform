import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  deviceInfo: {
    userAgent: String,
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    device: String,
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
  },
  location: {
    ip: String,
    country: String,
    city: String,
    region: String,
    latitude: Number,
    longitude: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  logoutTime: {
    type: Date,
  },
  logoutReason: {
    type: String,
    enum: ['user_initiated', 'token_expired', 'security_breach', 'admin_revoked', 'session_replaced'],
  },
}, {
  timestamps: true,
})

// Index for session cleanup
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ userId: 1, isActive: 1 })
sessionSchema.index({ lastActive: 1 })

// Check if session is expired
sessionSchema.methods.isExpired = function() {
  return this.expiresAt < new Date()
}

// Check if session is active
sessionSchema.methods.isSessionActive = function() {
  return this.isActive && !this.isExpired()
}

// Update last active time
sessionSchema.methods.updateLastActive = function() {
  this.lastActive = new Date()
  return this.save()
}

// Terminate session
sessionSchema.methods.terminate = function(reason = 'user_initiated') {
  this.isActive = false
  this.logoutTime = new Date()
  this.logoutReason = reason
  return this.save()
}

// Get session duration in minutes
sessionSchema.methods.getDuration = function() {
  const endTime = this.logoutTime || new Date()
  const duration = endTime - this.loginTime
  return Math.floor(duration / 1000 / 60) // minutes
}

// Get session info for display
sessionSchema.methods.getSessionInfo = function() {
  return {
    id: this._id,
    loginTime: this.loginTime,
    lastActive: this.lastActive,
    device: this.deviceInfo?.deviceType || 'unknown',
    browser: this.deviceInfo?.browser || 'unknown',
    os: this.deviceInfo?.os || 'unknown',
    location: this.location?.city ? `${this.location.city}, ${this.location.country}` : 'unknown',
    isActive: this.isSessionActive(),
    duration: this.getDuration(),
  }
}

export default mongoose.model('Session', sessionSchema)
