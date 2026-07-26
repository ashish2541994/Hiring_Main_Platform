import { body, param, query } from 'express-validator'

// Validation result formatter
export const formatValidationErrors = (errors) => {
  return errors.array().map(err => ({
    field: err.path,
    message: err.msg,
    value: err.value,
  }))
}

// ============================================
// AUTHENTICATION VALIDATION SCHEMAS
// ============================================

// Registration validation
export const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .custom(async (value) => {
      // Check if username already exists (to be implemented in controller)
      return true
    }),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character'),
  
  body('passwordConfirmation')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('role')
    .optional()
    .isIn(['candidate', 'recruiter', 'company'])
    .withMessage('Invalid role specified'),
  
  body('companyId')
    .optional()
    .isMongoId()
    .withMessage('Invalid company ID'),
  
  body('termsAccepted')
    .notEmpty()
    .withMessage('You must accept the terms and conditions')
    .isBoolean()
    .withMessage('Invalid terms acceptance value')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must accept the terms and conditions')
      }
      return true
    }),
]

// Login validation
export const loginValidation = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Email or username must be between 3 and 255 characters'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty'),
  
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Invalid remember me value'),
]

// Password change validation
export const changePasswordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 1 })
    .withMessage('Current password cannot be empty'),
  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('New password must contain at least one special character')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password')
      }
      return true
    }),
  
  body('passwordConfirmation')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
]

// Forgot password validation
export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
]

// Reset password validation
export const resetPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('New password must contain at least one special character'),
  
  body('passwordConfirmation')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
]

// Email verification validation
export const emailVerificationValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
]

// Resend OTP validation
export const resendOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
]

// ============================================
// PROFILE VALIDATION SCHEMAS
// ============================================

// Profile update validation
export const profileUpdateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('location.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country name must be between 2 and 100 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters'),
  
  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  
  body('location.zipCode')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9\s\-]+$/)
    .withMessage('Invalid zip code format'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .custom((skills) => {
      if (skills.length > 50) {
        throw new Error('Cannot add more than 50 skills')
      }
      return true
    }),
  
  body('socialLinks.linkedin')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  
  body('socialLinks.github')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  body('socialLinks.twitter')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  
  body('socialLinks.portfolio')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid portfolio URL'),
  
  body('socialLinks.website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
]

// ============================================
// JOB VALIDATION SCHEMAS
// ============================================

// Create job validation
export const createJobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50, max: 10000 })
    .withMessage('Job description must be between 50 and 10,000 characters'),
  
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Requirements cannot exceed 5,000 characters'),
  
  body('responsibilities')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Responsibilities cannot exceed 5,000 characters'),
  
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required')
    .custom((skills) => {
      if (skills.length > 20) {
        throw new Error('Cannot specify more than 20 skills')
      }
      return true
    }),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  
  body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Minimum salary cannot be negative')
      }
      return true
    }),
  
  body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error('Maximum salary cannot be negative')
      }
      if (req.body.salary.min && value < req.body.salary.min) {
        throw new Error('Maximum salary must be greater than minimum salary')
      }
      return true
    }),
  
  body('salary.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  
  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience level is required')
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  
  body('employmentType')
    .trim()
    .notEmpty()
    .withMessage('Employment type is required')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid employment type'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
    .custom((value) => {
      const deadline = new Date(value)
      const now = new Date()
      if (deadline < now) {
        throw new Error('Deadline cannot be in the past')
      }
      return true
    }),
  
  body('remote')
    .optional()
    .isBoolean()
    .withMessage('Invalid remote value'),
  
  body('companyId')
    .optional()
    .isMongoId()
    .withMessage('Invalid company ID'),
]

// Update job validation
export const updateJobValidation = [
  param('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Job description must be between 50 and 10,000 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .custom((skills) => {
      if (skills.length > 20) {
        throw new Error('Cannot specify more than 20 skills')
      }
      return true
    }),
  
  body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Minimum salary cannot be negative')
      }
      return true
    }),
  
  body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error('Maximum salary cannot be negative')
      }
      if (req.body.salary.min && value < req.body.salary.min) {
        throw new Error('Maximum salary must be greater than minimum salary')
      }
      return true
    }),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
    .custom((value) => {
      const deadline = new Date(value)
      const now = new Date()
      if (deadline < now) {
        throw new Error('Deadline cannot be in the past')
      }
      return true
    }),
]

// ============================================
// COMPANY VALIDATION SCHEMAS
// ============================================

// Create company validation
export const createCompanyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Company description is required')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Company description must be between 50 and 2,000 characters'),
  
  body('industry')
    .trim()
    .notEmpty()
    .withMessage('Industry is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Industry must be between 2 and 50 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Company location is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
]

// ============================================
// APPLICATION VALIDATION SCHEMAS
// ============================================

// Submit application validation
export const submitApplicationValidation = [
  body('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Cover letter cannot exceed 5,000 characters'),
  
  body('expectedSalary')
    .optional()
    .isNumeric()
    .withMessage('Expected salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Expected salary cannot be negative')
      }
      return true
    }),
  
  body('availableStartDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
]

// ============================================
// FILE UPLOAD VALIDATION SCHEMAS
// ============================================

// Image upload validation
export const imageUploadValidation = [
  body('fileType')
    .optional()
    .isIn(['avatar', 'company', 'job', 'gallery'])
    .withMessage('Invalid file type'),
]

// Resume upload validation
export const resumeUploadValidation = [
  body('candidateId')
    .optional()
    .isMongoId()
    .withMessage('Invalid candidate ID'),
]

// ============================================
// SEARCH VALIDATION SCHEMAS
// ============================================

// Job search validation
export const jobSearchValidation = [
  query('keyword')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search keyword cannot exceed 100 characters'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  query('experience')
    .optional()
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  
  query('employmentType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid employment type'),
  
  query('salaryMin')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Minimum salary cannot be negative')
      }
      return true
    }),
  
  query('salaryMax')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Maximum salary cannot be negative')
      }
      return true
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
]

// ============================================
// MESSAGE VALIDATION SCHEMAS
// ============================================

// Send message validation
export const sendMessageValidation = [
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5,000 characters'),
  
  body('jobId')
    .optional()
    .isMongoId()
    .withMessage('Invalid job ID'),
]

// ============================================
// PARAM VALIDATION SCHEMAS
// ============================================

// MongoDB ID validation
export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
]

// User ID validation
export const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
]

// Job ID validation
export const jobIdValidation = [
  param('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
]

// Company ID validation
export const companyIdValidation = [
  param('companyId')
    .isMongoId()
    .withMessage('Invalid company ID'),
]

// Application ID validation
export const applicationIdValidation = [
  param('applicationId')
    .isMongoId()
    .withMessage('Invalid application ID'),
]
