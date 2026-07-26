import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  revokedAt: {
    type: Date,
  },
  replacedBy: {
    type: String,
  },
  deviceInfo: {
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    ip: String,
  },
  location: {
    country: String,
    city: String,
  },
}, {
  timestamps: true,
})

// Index for token cleanup
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Check if token is expired
refreshTokenSchema.methods.isExpired = function() {
  return this.expiresAt < new Date()
}

// Check if token is revoked
refreshTokenSchema.methods.isRevoked = function() {
  return this.revoked
}

// Check if token is valid
refreshTokenSchema.methods.isValid = function() {
  return !this.isExpired() && !this.isRevoked()
}

// Revoke token
refreshTokenSchema.methods.revoke = function(replacedBy = null) {
  this.revoked = true
  this.revokedAt = new Date()
  if (replacedBy) {
    this.replacedBy = replacedBy
  }
  return this.save()
}

export default mongoose.model('RefreshToken', refreshTokenSchema)
