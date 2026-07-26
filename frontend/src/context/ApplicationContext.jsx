import { createContext, useContext, useState, useCallback } from 'react'

const ApplicationContext = createContext(null)

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    jobId: null,
  })

  // Set applications
  const setApplicationsData = useCallback((data) => {
    setApplications(data)
  }, [])

  // Add application
  const addApplication = useCallback((application) => {
    setApplications((prev) => [application, ...prev])
  }, [])

  // Update application
  const updateApplication = useCallback((applicationId, updates) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, ...updates } : app
      )
    )
  }, [])

  // Remove application
  const removeApplication = useCallback((applicationId) => {
    setApplications((prev) => prev.filter((app) => app._id !== applicationId))
  }, [])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      dateRange: null,
      jobId: null,
    })
  }, [])

  // Get filtered applications
  const getFilteredApplications = useCallback(() => {
    return applications.filter((app) => {
      if (filters.status !== 'all' && app.status !== filters.status) {
        return false
      }
      if (filters.jobId && app.jobId !== filters.jobId) {
        return false
      }
      if (filters.dateRange) {
        const appDate = new Date(appliedAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        if (appDate < startDate || appDate > endDate) {
          return false
        }
      }
      return true
    })
  }, [applications, filters])

  // Get application statistics
  const getStatistics = useCallback(() => {
    const stats = {
      total: applications.length,
      pending: 0,
      reviewed: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0,
    }

    applications.forEach((app) => {
      stats[app.status] = (stats[app.status] || 0) + 1
    })

    return stats
  }, [applications])

  const value = {
    applications,
    loading,
    filters,
    setLoading,
    setApplicationsData,
    addApplication,
    updateApplication,
    removeApplication,
    updateFilters,
    resetFilters,
    getFilteredApplications,
    getStatistics,
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplications = () => {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider')
  }
  return context
}
