import { validationResult } from 'express-validator'
import { formatValidationErrors } from '../utils/validationSchemas.js'

// Main validation handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formatValidationErrors(errors),
    })
  }
  
  next()
}

// Validation handler with custom error response
export const handleValidationErrorsCustom = (customMessage) => {
  return (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: customMessage || 'Validation failed',
        errors: formatValidationErrors(errors),
      })
    }
    
    next()
  }
}

// Validation handler that returns only first error
export const handleFirstValidationError = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]
    return res.status(400).json({
      success: false,
      message: firstError.msg,
      field: firstError.path,
      value: firstError.value,
    })
  }
  
  next()
}

// Validation handler for API responses with field-specific errors
export const handleFieldValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const fieldErrors = {}
    
    errors.array().forEach(error => {
      fieldErrors[error.path] = {
        message: error.msg,
        value: error.value,
      }
    })
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      fieldErrors,
    })
  }
  
  next()
}

// Async validation handler for database checks
export const handleAsyncValidation = (validationFn) => {
  return async (req, res, next) => {
    try {
      const result = await validationFn(req)
      
      if (result && result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
          field: result.field,
        })
      }
      
      next()
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error.message,
      })
    }
  }
}

// Combine validation schemas with handler
export const validate = (schemas) => {
  return [...schemas, handleValidationErrors]
}

// Validate with custom handler
export const validateWith = (schemas, handler) => {
  return [...schemas, handler]
}
