import { useState, useRef, useEffect, useCallback } from 'react'
import { AlertCircle, Check, RefreshCw } from 'lucide-react'
import { validateOTP } from '../../utils/validation'

export const OTPInput = ({
  value,
  onChange,
  length = 6,
  error,
  helperText,
  isLoading = false,
  onResend,
  resendCooldown = 60,
  className = '',
  ...props
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef([])
  const [cooldown, setCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // Handle cooldown timer
  useEffect(() => {
    let interval
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cooldown])

  // Initialize OTP from value prop
  useEffect(() => {
    if (value) {
      const otpArray = value.toString().split('')
      const newOtp = new Array(length).fill('')
      otpArray.forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit
        }
      })
      setOtp(newOtp)
    }
  }, [value, length])

  const handleChange = useCallback((index, digit) => {
    // Only allow numbers
    if (!/^\d*$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Update parent value
    const otpValue = newOtp.join('')
    onChange(otpValue)

    // Auto-submit when complete
    if (otpValue.length === length) {
      props.onComplete?.(otpValue)
    }
  }, [otp, length, onChange, props])

  const handleKeyDown = useCallback((index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      
      if (otp[index]) {
        // Clear current digit
        newOtp[index] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
      } else if (index > 0) {
        // Move to previous input and clear
        newOtp[index - 1] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      // Paste will be handled by onPaste
    }
  }, [otp, length, onChange])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Validate pasted data
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.split('').slice(0, length)
    const newOtp = new Array(length).fill('')
    
    digits.forEach((digit, index) => {
      newOtp[index] = digit
    })

    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Focus on the next empty input or the last filled one
    const nextFocusIndex = Math.min(digits.length, length - 1)
    inputRefs.current[nextFocusIndex]?.focus()
  }, [length, onChange])

  const handleFocus = useCallback((index) => {
    setFocusedIndex(index)
  }, [])

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    try {
      await onResend()
      setCooldown(resendCooldown)
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsResending(false)
    }
  }, [cooldown, isResending, onResend, resendCooldown])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={isLoading}
            className={`
              w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
              ${focusedIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
              ${digit ? 'bg-blue-50 border-blue-300' : 'bg-white'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {otp.join('').length === length && !error && (
        <p className="text-sm text-green-600 flex items-center justify-center gap-1">
          <Check className="w-4 h-4" />
          OTP entered successfully
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500 text-center">{helperText}</p>
      )}

      {/* Resend Button */}
      {onResend && (
        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in <span className="font-semibold">{formatTime(cooldown)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend OTP'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// OTP Verification Card Component
export const OTPVerificationCard = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error,
  className = '',
}) => {
  const [otp, setOtp] = useState('')
  const [localError, setLocalError] = useState(null)

  const handleOTPChange = useCallback((value) => {
    setOtp(value)
    setLocalError(null)
  }, [])

  const handleVerify = useCallback(async () => {
    const validation = validateOTP(otp)
    
    if (!validation.isValid) {
      setLocalError(validation.message)
      return
    }

    try {
      await onVerify(otp)
    } catch (err) {
      setLocalError(err.message || 'OTP verification failed')
    }
  }, [otp, onVerify])

  const handleComplete = useCallback((completedOTP) => {
    // Auto-verify when OTP is complete
    if (completedOTP.length === 6) {
      handleVerify()
    }
  }, [handleVerify])

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          Verify Your Email
        </h3>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit OTP to <span className="font-medium">{email}</span>
        </p>
      </div>

      <OTPInput
        value={otp}
        onChange={handleOTPChange}
        length={6}
        error={error || localError}
        helperText="Enter the 6-digit code from your email"
        isLoading={isLoading}
        onResend={onResend}
        resendCooldown={60}
        onComplete={handleComplete}
      />

      <button
        type="button"
        onClick={handleVerify}
        disabled={otp.length !== 6 || isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Didn't receive the OTP? Check your spam folder or request a new one.
      </p>
    </div>
  )
}

// Phone OTP Input Component
export const PhoneOTPInput = ({
  value,
  onChange,
  length = 6,
  error,
  isLoading = false,
  onResend,
  resendCooldown = 60,
  className = '',
  ...props
}) => {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      length={length}
      error={error}
      helperText="Enter the 6-digit code sent to your phone"
      isLoading={isLoading}
      onResend={onResend}
      resendCooldown={resendCooldown}
      className={className}
      {...props}
    />
  )
}

// OTP with Countdown Timer Component
export const OTPWithTimer = ({
  value,
  onChange,
  onVerify,
  onResend,
  expiryMinutes = 10,
  isLoading = false,
  error,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [expiryMinutes])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">OTP expires in:</span>
        <span className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
          {isExpired ? 'Expired' : formatTime(timeLeft)}
        </span>
      </div>

      <OTPInput
        value={value}
        onChange={onChange}
        error={error}
        isLoading={isLoading}
        onResend={onResend}
        resendCooldown={60}
      />

      {isExpired && (
        <button
          type="button"
          onClick={onResend}
          className="w-full py-2 px-4 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors"
        >
          Request New OTP
        </button>
      )}
    </div>
  )
}
