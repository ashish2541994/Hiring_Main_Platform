import { memo, useMemo, useCallback } from 'react'

// Higher-order component for memoization
export const withMemo = (Component, arePropsEqual) => {
  return memo(Component, arePropsEqual)
}

// Custom hook for memoized value with dependency comparison
export const useDeepMemo = (value, deps) => {
  return useMemo(() => value, deps)
}

// Custom hook for memoized callback with deep comparison
export const useDeepCallback = (callback, deps) => {
  return useCallback(callback, deps)
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load component wrapper
export const lazyLoad = (importFunc, fallback = null) => {
  const LazyComponent = lazy(() => importFunc())
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Memoize expensive calculations
export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// Clear memoization cache
export const clearMemoization = (memoizedFn) => {
  if (memoizedFn.cache) {
    memoizedFn.cache.clear()
  }
}
