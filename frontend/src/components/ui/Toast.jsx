import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const ToastContext = createContext(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now()
    const newToast = {
      id,
      ...toast,
      createdAt: new Date(),
    }

    setToasts(prev => [...prev, newToast])

    // Auto dismiss after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options,
    })
  }, [addToast])

  const error = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      ...options,
    })
  }, [addToast])

  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options,
    })
  }, [addToast])

  const info = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options,
    })
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={`
        pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-lg border shadow-lg
          min-w-[300px] max-w-md
          ${bgColors[toast.type]}
        `}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>

        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-sm text-gray-900 mb-1">
              {toast.title}
            </p>
          )}
          <p className="text-sm text-gray-700 break-words">
            {toast.message}
          </p>
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Pre-configured toast messages
export const toastMessages = {
  // Success messages
  registrationSuccessful: 'Registration successful! Please check your email to verify your account.',
  loginSuccessful: 'Login successful! Welcome back.',
  otpVerified: 'OTP verified successfully!',
  profileUpdated: 'Profile updated successfully.',
  passwordChanged: 'Password changed successfully. Please login with your new password.',
  jobCreated: 'Job created successfully.',
  jobUpdated: 'Job updated successfully.',
  jobDeleted: 'Job deleted successfully.',
  applicationSubmitted: 'Application submitted successfully!',
  resumeUploaded: 'Resume uploaded successfully.',
  imageUploaded: 'Image uploaded successfully.',
  companyCreated: 'Company created successfully.',
  companyUpdated: 'Company updated successfully.',
  messageSent: 'Message sent successfully.',
  sessionTerminated: 'Session terminated successfully.',
  loggedOut: 'Logged out successfully.',

  // Error messages
  somethingWentWrong: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
  unauthorized: 'Unauthorized access. Please login.',
  sessionExpired: 'Session expired. Please login again.',
  invalidCredentials: 'Invalid credentials. Please check your email and password.',
  accessDenied: 'Access denied. You do not have permission.',
  accountNotFound: 'Account not found.',
  accountLocked: 'Account is temporarily locked due to too many failed attempts.',
  emailNotVerified: 'Email not verified. Please verify your email to continue.',
  otpExpired: 'OTP has expired. Please request a new one.',
  otpInvalid: 'Invalid OTP. Please try again.',
  maxAttemptsReached: 'Maximum attempts reached. Please try again later.',
  emailAlreadyExists: 'Email already registered. Please login or use a different email.',
  usernameTaken: 'Username already taken. Please choose a different one.',
  passwordMismatch: 'Passwords do not match.',
  weakPassword: 'Password is too weak. Please choose a stronger password.',
  fileTooLarge: 'File is too large. Please upload a smaller file.',
  invalidFileType: 'Invalid file type. Please upload a valid file.',
  uploadFailed: 'Upload failed. Please try again.',
  deleteFailed: 'Failed to delete. Please try again.',
  updateFailed: 'Update failed. Please try again.',

  // Warning messages
  unsavedChanges: 'You have unsaved changes. Please save before leaving.',
  accountDeactivation: 'Your account will be deactivated. Are you sure?',
  dataLossWarning: 'This action cannot be undone. Are you sure?',
  sessionWarning: 'Your session will expire soon. Please save your work.',

  // Info messages
  emailSent: 'Email sent successfully.',
  otpSent: 'OTP sent to your email.',
  loading: 'Loading...',
  processing: 'Processing...',
  uploading: 'Uploading...',
  saving: 'Saving...',
  deleting: 'Deleting...',
}

// Helper function to show toast with pre-configured message
export const showToast = (type, messageKey, customMessage, options = {}) => {
  const { useToast: useToastHook } = require('./Toast')
  const toast = useToastHook()
  
  const message = customMessage || toastMessages[messageKey] || messageKey
  
  return toast[type](message, options)
}
