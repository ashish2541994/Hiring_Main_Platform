import jwtUtils from '../utils/jwtUtils.js'

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  guest: 0,
  candidate: 1,
  interviewer: 2,
  hr: 3,
  recruiter: 4,
  company: 5,
  admin: 6,
  super_admin: 7,
}

// Role permissions
const ROLE_PERMISSIONS = {
  guest: ['view_public_jobs'],
  candidate: [
    'view_public_jobs',
    'apply_job',
    'save_job',
    'edit_own_profile',
    'upload_own_resume',
    'view_own_applications',
    'withdraw_application',
  ],
  interviewer: [
    'view_public_jobs',
    'view_assigned_interviews',
    'conduct_interview',
    'submit_interview_feedback',
    'edit_own_profile',
  ],
  hr: [
    'view_public_jobs',
    'view_company_jobs',
    'create_job',
    'edit_own_job',
    'view_applications',
    'schedule_interview',
    'conduct_interview',
    'submit_interview_feedback',
    'edit_own_profile',
    'view_analytics',
  ],
  recruiter: [
    'view_public_jobs',
    'view_company_jobs',
    'create_job',
    'edit_own_job',
    'delete_own_job',
    'view_applications',
    'manage_candidates',
    'schedule_interview',
    'conduct_interview',
    'submit_interview_feedback',
    'edit_own_profile',
    'view_analytics',
    'message_candidates',
  ],
  company: [
    'view_public_jobs',
    'view_company_jobs',
    'create_job',
    'edit_company_job',
    'delete_company_job',
    'view_applications',
    'manage_recruiters',
    'manage_candidates',
    'schedule_interview',
    'edit_company_profile',
    'view_analytics',
    'manage_billing',
    'message_candidates',
  ],
  admin: [
    'view_all_jobs',
    'create_job',
    'edit_any_job',
    'delete_any_job',
    'view_all_applications',
    'manage_all_users',
    'manage_companies',
    'view_all_analytics',
    'moderate_content',
    'manage_settings',
    'view_audit_logs',
    'manage_roles',
    'ban_user',
    'verify_company',
  ],
  super_admin: [
    '*',
  ],
}

// Check if role has permission
const hasPermission = (role, permission) => {
  if (role === 'super_admin') return true
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes('*') || permissions.includes(permission)
}

// Check if role is at least the specified level
const hasRoleLevel = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}

// Check if user can access resource (ownership check)
const canAccessResource = (user, resourceOwnerId) => {
  // Super admins and admins can access any resource
  if (user.role === 'super_admin' || user.role === 'admin') return true
  
  // Company role can access company resources
  if (user.role === 'company' && user.companyId) {
    return resourceOwnerId === user.companyId.toString()
  }
  
  // Recruiters and HR can access company resources
  if ((user.role === 'recruiter' || user.role === 'hr') && user.companyId) {
    return resourceOwnerId === user.companyId.toString()
  }
  
  // Other roles can only access their own resources
  return resourceOwnerId === user._id.toString()
}

// Middleware to verify JWT token
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const token = authHeader.substring(7)
    const verification = jwtUtils.verifyAccessToken(token)

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: verification.error,
      })
    }

    req.user = {
      userId: verification.decoded.userId,
      email: verification.decoded.email,
      role: verification.decoded.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    })
  }
}

// Middleware to check if user has specific permission
export const authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermission: permission,
      })
    }

    next()
  }
}

// Middleware to check if user has specific role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role privileges',
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      })
    }

    next()
  }
}

// Middleware to check if user has minimum role level
export const requireRoleLevel = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!hasRoleLevel(req.user.role, minimumRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role level',
 minimumRole,
        userRole: req.user.role,
      })
    }

    next()
  }
}

// Middleware to check resource ownership
export const requireOwnership = (getResourceOwnerId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    try {
      const resourceOwnerId = await getResourceOwnerId(req)
      
      if (!canAccessResource(req.user, resourceOwnerId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this resource',
        })
      }

      next()
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        error: error.message,
      })
    }
  }
}

// Middleware to check if user is verified
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
    })
  }

  next()
}

// Middleware to check if user account is active
export const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is inactive',
      code: 'ACCOUNT_INACTIVE',
    })
  }

  next()
}

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const verification = jwtUtils.verifyAccessToken(token)

      if (verification.valid) {
        req.user = {
          userId: verification.decoded.userId,
          email: verification.decoded.email,
          role: verification.decoded.role,
        }
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

// Utility function to check permissions (for use in services)
export const checkPermission = (role, permission) => {
  return hasPermission(role, permission)
}

// Utility function to check role level (for use in services)
export const checkRoleLevel = (userRole, requiredRole) => {
  return hasRoleLevel(userRole, requiredRole)
}

// Get all permissions for a role
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || []
}

// Get role hierarchy level
export const getRoleLevel = (role) => {
  return ROLE_HIERARCHY[role] || 0
}
