import { useMemo, useCallback, useRef, useState } from 'react'

// Memoize expensive computations
export const useMemoized = (factory, deps) => {
  return useMemo(factory, deps)
}

// Memoize callback with stable reference
export const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args) => callbackRef.current(...args), [])
}

// Memoize async function with loading state
export const useMemoizedAsync = (asyncFn, deps) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn, ...deps])

  return { data, loading, error, execute }
}

// Memoize object with deep comparison
export const useMemoizedObject = (obj, deps) => {
  return useMemo(() => ({ ...obj }), deps)
}

// Memoize array with deep comparison
export const useMemoizedArray = (arr, deps) => {
  return useMemo(() => [...arr], deps)
}
