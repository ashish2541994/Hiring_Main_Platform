import { useState, useCallback, useMemo } from 'react'

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])
  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages])
  const hasPreviousPage = useMemo(() => page > 1, [page])
  const startIndex = useMemo(() => (page - 1) * limit, [page, limit])
  const endIndex = useMemo(() => Math.min(startIndex + limit, total), [startIndex, limit, total])

  const goToPage = useCallback((pageNumber) => {
    setPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const firstPage = useCallback(() => {
    setPage(1)
  }, [])

  const lastPage = useCallback(() => {
    setPage(totalPages)
  }, [totalPages])

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setPage(initialPage)
    setLimit(initialLimit)
  }, [initialPage, initialLimit])

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    setPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changeLimit,
    reset,
  }
}

export default usePagination
