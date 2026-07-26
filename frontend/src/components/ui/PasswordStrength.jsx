import { useState, useEffect } from 'react'
import { Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { validatePassword, getStrengthLabel, getStrengthColor } from '../../utils/validation'

export const PasswordStrength = ({ password, showMeter = true, showChecklist = true }) => {
  const [validation, setValidation] = useState(null)

  useEffect(() => {
    if (password) {
      setValidation(validatePassword(password))
    } else {
      setValidation(null)
    }
  }, [password])

  if (!validation) return null

  const { checks, strength, strengthLabel, strengthColor } = validation

  return (
    <div className="space-y-3">
      {/* Strength Meter */}
      {showMeter && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Password Strength</span>
            <span 
              className="text-sm font-semibold" 
              style={{ color: strengthColor }}
            >
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${strength}%`,
                backgroundColor: strengthColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Password Checklist */}
      {showChecklist && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
          <div className="space-y-1.5">
            <RequirementItem
              label="Minimum 8 characters"
              met={checks.minLength}
            />
            <RequirementItem
              label="One uppercase letter"
              met={checks.hasUppercase}
            />
            <RequirementItem
              label="One lowercase letter"
              met={checks.hasLowercase}
            />
            <RequirementItem
              label="One number"
              met={checks.hasNumber}
            />
            <RequirementItem
              label="One special character"
              met={checks.hasSpecial}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const RequirementItem = ({ label, met }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={met ? 'text-gray-700' : 'text-gray-400'}>
        {label}
      </span>
    </div>
  )
}

// Password Input Component with Toggle and Strength
export const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Enter password',
  showStrength = true,
  showChecklist = true,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)

  const handleKeyDown = (e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
  }

  const handleKeyUp = (e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className={`
            w-full px-4 py-2.5 pr-10 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Caps Lock Warning */}
      {isCapsLockOn && (
        <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
          <AlertCircle className="w-4 h-4" />
          <span>Caps Lock is on</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Password Strength */}
      {showStrength && value && (
        <PasswordStrength
          password={value}
          showMeter={true}
          showChecklist={showChecklist}
        />
      )}
    </div>
  )
}

// Confirm Password Input Component
export const ConfirmPasswordInput = ({
  password,
  confirmPassword,
  onChange,
  placeholder = 'Confirm password',
  error,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)

  const handleKeyDown = (e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
  }

  const handleKeyUp = (e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
  }

  const getMatchStatus = () => {
    if (!confirmPassword) return null
    return password === confirmPassword
  }

  const matchStatus = getMatchStatus()

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className={`
            w-full px-4 py-2.5 pr-10 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${matchStatus === true ? 'border-green-500 focus:ring-green-500' : ''}
            ${matchStatus === false ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Caps Lock Warning */}
      {isCapsLockOn && (
        <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
          <AlertCircle className="w-4 h-4" />
          <span>Caps Lock is on</span>
        </div>
      )}

      {/* Match Status */}
      {matchStatus === true && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Passwords match
        </p>
      )}

      {matchStatus === false && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          Passwords do not match
        </p>
      )}

      {/* Error Message */}
      {error && !matchStatus && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
