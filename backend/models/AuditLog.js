import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'login_failed',
      'password_change',
      'password_reset_requested',
      'password_reset_completed',
      'email_verification',
      'profile_update',
      'avatar_update',
      'resume_upload',
      'job_create',
      'job_update',
      'job_delete',
      'job_apply',
      'admin_user_create',
      'admin_user_update',
      'admin_user_delete',
      'admin_role_change',
      'company_create',
      'company_update',
      'company_delete',
      'recruiter_invite',
      'interview_schedule',
      'interview_cancel',
      'security_breach',
      'account_locked',
      'account_unlocked',
      'session_terminated',
      'token_refreshed',
    ],
  },
  entityType: {
    type: String,
    enum: ['user', 'job', 'company', 'application', 'session', 'system'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
  },
  location: {
    country: String,
    city: String,
    region: String,
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success',
  },
  errorMessage: {
    type: String,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
}, {
  timestamps: true,
})

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 })
auditLogSchema.index({ severity: 1, createdAt: -1 })
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }) // Auto-delete after 1 year

// Static method to log an action
auditLogSchema.statics.logAction = async function(data) {
  try {
    return await this.create(data)
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw error to prevent breaking the main flow
  }
}

// Static method to get user activity
auditLogSchema.statics.getUserActivity = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email avatar')
}

// Static method to get security events
auditLogSchema.statics.getSecurityEvents = function(severity = 'high', limit = 100) {
  return this.find({ 
    severity: { $in: [severity, 'critical'] },
    action: { $in: ['login_failed', 'security_breach', 'account_locked', 'session_terminated'] }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email')
}

// Static method to get failed login attempts
auditLogSchema.statics.getFailedLoginAttempts = function(userId, timeWindow = 15) {
  const since = new Date(Date.now() - timeWindow * 60 * 1000)
  return this.countDocuments({
    userId,
    action: 'login_failed',
    status: 'failure',
    createdAt: { $gte: since }
  })
}

export default mongoose.model('AuditLog', auditLogSchema)
