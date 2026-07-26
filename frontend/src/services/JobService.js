import { jobApi } from './index'
import toast from 'react-hot-toast'

class JobService {
  // Get jobs with error handling and loading state
  async getJobs(filters = {}) {
    try {
      const response = await jobApi.getJobs(filters)
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      }
    } catch (error) {
      toast.error('Failed to fetch jobs')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch jobs',
      }
    }
  }

  // Get job details
  async getJobDetails(jobId) {
    try {
      const response = await jobApi.getJobById(jobId)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      toast.error('Failed to fetch job details')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch job details',
      }
    }
  }

  // Create job with validation
  async createJob(jobData) {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'requirements', 'type', 'experienceLevel']
      const missingFields = requiredFields.filter(field => !jobData[field])
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`)
        return {
          success: false,
          error: 'Validation failed',
        }
      }

      const response = await jobApi.createJob(jobData)
      toast.success('Job posted successfully')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to post job',
      }
    }
  }

  // Update job
  async updateJob(jobId, jobData) {
    try {
      const response = await jobApi.updateJob(jobId, jobData)
      toast.success('Job updated successfully')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      toast.error('Failed to update job')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update job',
      }
    }
  }

  // Delete job with confirmation
  async deleteJob(jobId) {
    try {
      await jobApi.deleteJob(jobId)
      toast.success('Job deleted successfully')
      return {
        success: true,
      }
    } catch (error) {
      toast.error('Failed to delete job')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete job',
      }
    }
  }

  // Search jobs with debouncing
  async searchJobs(query, filters = {}) {
    try {
      const response = await jobApi.searchJobs(query, filters)
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed',
      }
    }
  }

  // Save job for candidate
  async saveJob(jobId) {
    try {
      await jobApi.saveJob(jobId)
      toast.success('Job saved')
      return {
        success: true,
      }
    } catch (error) {
      toast.error('Failed to save job')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save job',
      }
    }
  }

  // Unsave job
  async unsaveJob(jobId) {
    try {
      await jobApi.unsaveJob(jobId)
      toast.success('Job removed from saved')
      return {
        success: true,
      }
    } catch (error) {
      toast.error('Failed to remove job')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove job',
      }
    }
  }

  // Apply to job
  async applyToJob(jobId, applicationData) {
    try {
      // Validate application data
      if (!applicationData.coverLetter && !applicationData.resume) {
        toast.error('Please provide either a cover letter or resume')
        return {
          success: false,
          error: 'Validation failed',
        }
      }

      const response = await jobApi.applyToJob(jobId, applicationData)
      toast.success('Application submitted successfully')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application')
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit application',
      }
    }
  }

  // Get job statistics
  async getJobStatistics(jobId) {
    try {
      const response = await jobApi.getJobStats(jobId)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch statistics',
      }
    }
  }

  // Get similar jobs
  async getSimilarJobs(jobId, limit = 5) {
    try {
      const response = await jobApi.getSimilarJobs(jobId, limit)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch similar jobs',
      }
    }
  }
}

export default new JobService()
