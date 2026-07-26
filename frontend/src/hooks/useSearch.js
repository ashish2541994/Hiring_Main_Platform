import { useState, useCallback } from 'react'
import useDebounce from './useDebounce'

const useSearch = (initialQuery = '', delay = 500) => {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, delay)

  const handleSearch = useCallback((value) => {
    setQuery(value)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
  }, [])

  const resetSearch = useCallback(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  return {
    query,
    debouncedQuery,
    setQuery,
    handleSearch,
    clearSearch,
    resetSearch,
  }
}

export default useSearch
