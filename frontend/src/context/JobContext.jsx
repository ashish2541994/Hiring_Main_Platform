import { createContext, useContext, useState, useCallback } from 'react'

const JobContext = createContext(null)

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
    experienceLevel: 'all',
    salaryRange: null,
    remote: false,
  })

  // Set jobs
  const setJobsData = useCallback((data) => {
    setJobs(data)
  }, [])

  // Add job
  const addJob = useCallback((job) => {
    setJobs((prev) => [job, ...prev])
  }, [])

  // Update job
  const updateJob = useCallback((jobId, updates) => {
    setJobs((prev) =>
      prev.map((job) => (job._id === jobId ? { ...job, ...updates } : job))
    )
  }, [])

  // Remove job
  const removeJob = useCallback((jobId) => {
    setJobs((prev) => prev.filter((job) => job._id !== jobId))
  }, [])

  // Set saved jobs
  const setSavedJobsData = useCallback((data) => {
    setSavedJobs(data)
  }, [])

  // Add to saved jobs
  const addToSaved = useCallback((jobId) => {
    const job = jobs.find((j) => j._id === jobId)
    if (job) {
      setSavedJobs((prev) => [...prev, job])
    }
  }, [jobs])

  // Remove from saved jobs
  const removeFromSaved = useCallback((jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId))
  }, [])

  // Check if job is saved
  const isJobSaved = useCallback(
    (jobId) => {
      return savedJobs.some((job) => job._id === jobId)
    },
    [savedJobs]
  )

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      location: '',
      type: 'all',
      experienceLevel: 'all',
      salaryRange: null,
      remote: false,
    })
  }, [])

  // Get filtered jobs
  const getFilteredJobs = useCallback(() => {
    return jobs.filter((job) => {
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      if (filters.type !== 'all' && job.type !== filters.type) {
        return false
      }
      if (filters.experienceLevel !== 'all' && job.experienceLevel !== filters.experienceLevel) {
        return false
      }
      if (filters.remote && !job.remote) {
        return false
      }
      if (filters.salaryRange) {
        const jobSalary = job.salaryMin || 0
        if (jobSalary < filters.salaryRange.min || jobSalary > filters.salaryRange.max) {
          return false
        }
      }
      return true
    })
  }, [jobs, filters])

  // Get job statistics
  const getStatistics = useCallback(() => {
    const stats = {
      total: jobs.length,
      byType: {},
      byExperience: {},
      byLocation: {},
    }

    jobs.forEach((job) => {
      stats.byType[job.type] = (stats.byType[job.type] || 0) + 1
      stats.byExperience[job.experienceLevel] = (stats.byExperience[job.experienceLevel] || 0) + 1
      stats.byLocation[job.location] = (stats.byLocation[job.location] || 0) + 1
    })

    return stats
  }, [jobs])

  const value = {
    jobs,
    savedJobs,
    loading,
    filters,
    setLoading,
    setJobsData,
    setSavedJobsData,
    addJob,
    updateJob,
    removeJob,
    addToSaved,
    removeFromSaved,
    isJobSaved,
    updateFilters,
    resetFilters,
    getFilteredJobs,
    getStatistics,
  }

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  )
}

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within JobProvider')
  }
  return context
}
