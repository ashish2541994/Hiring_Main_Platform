import { useState, useEffect, useCallback, useRef } from 'react'

const useInfiniteScroll = (fetchFunction, options = {}) => {
  const {
    threshold = 100,
    initialPage = 1,
    pageSize = 10,
  } = options

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)
  const [error, setError] = useState(null)

  const observerRef = useRef(null)
  const loadingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFunction(page, pageSize)
      
      if (response.length === 0) {
        setHasMore(false)
      } else {
        setData((prev) => [...prev, ...response])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [fetchFunction, page, pageSize, hasMore])

  const reset = useCallback(() => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
    setError(null)
    loadingRef.current = false
  }, [initialPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
      observer.disconnect()
    }
  }, [loading, hasMore, loadMore, threshold])

  return {
    data,
    loading,
    hasMore,
    error,
    observerRef,
    loadMore,
    reset,
  }
}

export default useInfiniteScroll
