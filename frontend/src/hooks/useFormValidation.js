import { useState, useCallback, useEffect } from 'react'
import { validateForm, hasErrors, sanitizeFormData } from '../utils/validation'

// Main form validation hook
export const useFormValidation = (initialValues, validationRules, options = {}) => {
  const {
    validateOnBlur = true,
    validateOnChange = true,
    debounceMs = 300,
    sanitize = true,
  } = options

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Validate entire form
  const validateFormValues = useCallback(() => {
    const result = validateForm(values, validationRules)
    setErrors(result.errors)
    setIsValid(result.isValid)
    return result
  }, [values, validationRules])

  // Validate single field
  const validateField = useCallback((fieldName) => {
    const rules = validationRules[fieldName]
    if (!rules) return { isValid: true }

    const value = values[fieldName]
    for (const rule of rules) {
      const result = rule(value)
      if (!result.isValid) {
        setErrors(prev => ({ ...prev, [fieldName]: result.message }))
        return result
      }
    }

    setErrors(prev => ({ ...prev, [fieldName]: undefined }))
    return { isValid: true }
  }, [values, validationRules])

  // Handle field change
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => {
      const newValues = { ...prev, [fieldName]: value }
      setIsDirty(true)
      return newValues
    })

    if (validateOnChange && touched[fieldName]) {
      validateField(fieldName)
    }
  }, [validateOnChange, touched, validateField])

  // Handle field blur
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))

    if (validateOnBlur) {
      validateField(fieldName)
    }
  }, [validateOnBlur, validateField])

  // Handle field focus
  const handleFocus = useCallback((fieldName) => {
    // Optional: Clear error on focus
    // setErrors(prev => ({ ...prev, [fieldName]: undefined }))
  }, [])

  // Set field value directly
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setIsDirty(true)
  }, [])

  // Set multiple field values
  const setFieldValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }))
    setIsDirty(true)
  }, [])

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsValid(false)
    setIsDirty(false)
  }, [initialValues])

  // Reset specific field
  const resetField = useCallback((fieldName) => {
    setValues(prev => ({ ...prev, [fieldName]: initialValues[fieldName] }))
    setErrors(prev => ({ ...prev, [fieldName]: undefined }))
    setTouched(prev => ({ ...prev, [fieldName]: false }))
  }, [initialValues])

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Clear specific field error
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: undefined }))
  }, [])

  // Get form data (sanitized if enabled)
  const getFormData = useCallback(() => {
    return sanitize ? sanitizeFormData(values) : values
  }, [values, sanitize])

  // Check if form has errors
  const hasFormErrors = useCallback(() => {
    return hasErrors(errors)
  }, [errors])

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return !!errors[fieldName]
  }, [errors])

  // Get field error message
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || ''
  }, [errors])

  // Check if field is touched
  const isFieldTouched = useCallback((fieldName) => {
    return touched[fieldName] || false
  }, [touched])

  // Validate form on mount
  useEffect(() => {
    if (Object.keys(validationRules).length > 0) {
      validateFormValues()
    }
  }, [])

  // Update validation when rules change
  useEffect(() => {
    validateFormValues()
  }, [validationRules])

  return {
    // State
    values,
    errors,
    touched,
    isValid,
    isDirty,

    // Handlers
    handleChange,
    handleBlur,
    handleFocus,
    setFieldValue,
    setFieldValues,
    resetForm,
    resetField,
    clearErrors,
    clearFieldError,

    // Validation
    validateForm: validateFormValues,
    validateField,

    // Helpers
    getFormData,
    hasErrors: hasFormErrors,
    hasFieldError,
    getFieldError,
    isFieldTouched,
  }
}

// Simple form hook for basic forms
export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setIsDirty(true)
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setIsDirty(false)
  }, [initialValues])

  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setIsDirty(true)
  }, [])

  return {
    values,
    isDirty,
    handleChange,
    setFieldValue,
    resetForm,
  }
}

// Async validation hook
export const useAsyncValidation = (validationFn, debounceMs = 500) => {
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState(null)
  const [isValid, setIsValid] = useState(null)

  const validate = useCallback(async (value) => {
    setIsValidating(true)
    setError(null)

    try {
      const result = await validationFn(value)
      setIsValid(result.isValid)
      setError(result.error || null)
      return result
    } catch (err) {
      setError(err.message)
      setIsValid(false)
      return { isValid: false, error: err.message }
    } finally {
      setIsValidating(false)
    }
  }, [validationFn])

  const debouncedValidate = useCallback((value) => {
    let timeoutId
    return new Promise((resolve) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        resolve(validate(value))
      }, debounceMs)
    })
  }, [validate, debounceMs])

  return {
    isValidating,
    error,
    isValid,
    validate,
    debouncedValidate,
  }
}

// Password strength hook
export const usePasswordStrength = () => {
  const [strength, setStrength] = useState(0)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('')

  const checkStrength = useCallback((password) => {
    if (!password) {
      setStrength(0)
      setLabel('')
      setColor('')
      return
    }

    let score = 0

    // Length
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complexity
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    // Bonus
    if (password.length >= 16) score += 1
    if (!/(.)\1{2,}/.test(password)) score += 1

    setStrength(score)

    // Set label and color
    if (score <= 2) {
      setLabel('Weak')
      setColor('#ef4444')
    } else if (score <= 4) {
      setLabel('Fair')
      setColor('#eab308')
    } else if (score <= 6) {
      setLabel('Good')
      setColor('#22c55e')
    } else {
      setLabel('Strong')
      setColor('#15803d')
    }
  }, [])

  return {
    strength,
    label,
    color,
    checkStrength,
  }
}

// Form submission hook
export const useFormSubmit = (submitFn, options = {}) => {
  const {
    onSuccess,
    onError,
    onFinally,
    resetOnSuccess = false,
  } = options

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const submit = useCallback(async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const result = await submitFn(data)
      setSubmitSuccess(true)
      
      if (onSuccess) {
        onSuccess(result)
      }

      return { success: true, data: result }
    } catch (error) {
      setSubmitError(error.message)
      
      if (onError) {
        onError(error)
      }

      return { success: false, error }
    } finally {
      setIsSubmitting(false)
      
      if (onFinally) {
        onFinally()
      }
    }
  }, [submitFn, onSuccess, onError, onFinally])

  const resetSubmitState = useCallback(() => {
    setIsSubmitting(false)
    setSubmitError(null)
    setSubmitSuccess(false)
  }, [])

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submit,
    resetSubmitState,
  }
}

// Unsaved changes protection hook
export const useUnsavedChanges = (isDirty, message = 'You have unsaved changes. Do you want to leave without saving?') => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, message])

  const confirmNavigation = useCallback(() => {
    return window.confirm(message)
  }, [message])

  return {
    confirmNavigation,
  }
}

// Caps lock detection hook
export const useCapsLock = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)

  const handleKeyDown = useCallback((e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
  }, [])

  return {
    isCapsLockOn,
    handleKeyDown,
  }
}
