import mongoose from 'mongoose'

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset', 'phone_verification'],
    default: 'email_verification',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster lookups
OTPSchema.index({ email: 1, type: 1, isUsed: 1 })
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Method to check if OTP is expired
OTPSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt
}

// Method to check if OTP is valid
OTPSchema.methods.isValid = function(enteredOTP) {
  if (this.isExpired() || this.isUsed) {
    return false
  }
  if (this.attempts >= 3) {
    return false
  }
  return this.otp === enteredOTP
}

// Method to mark as used
OTPSchema.methods.markAsUsed = function() {
  this.isUsed = true
  this.usedAt = new Date()
  return this.save()
}

// Method to increment attempts
OTPSchema.methods.incrementAttempts = function() {
  this.attempts += 1
  return this.save()
}

const OTP = mongoose.model('OTP', OTPSchema)

export default OTP
