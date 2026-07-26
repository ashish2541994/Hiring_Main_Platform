import api from './api'

const reportApi = {
  // Create report
  createReport: (reportData) => {
    return api.post('/reports', reportData)
  },

  // Get all reports (admin)
  getAllReports: (params = {}) => {
    return api.get('/reports', { params })
  },

  // Get report by ID
  getReportById: (reportId) => {
    return api.get(`/reports/${reportId}`)
  },

  // Get user's reports
  getUserReports: (params = {}) => {
    return api.get('/reports/my-reports', { params })
  },

  // Update report
  updateReport: (reportId, reportData) => {
    return api.put(`/reports/${reportId}`, reportData)
  },

  // Delete report
  deleteReport: (reportId) => {
    return api.delete(`/reports/${reportId}`)
  },

  // Resolve report (admin)
  resolveReport: (reportId, resolutionData) => {
    return api.put(`/reports/${reportId}/resolve`, resolutionData)
  },

  // Get report statistics (admin)
  getReportStats: (params = {}) => {
    return api.get('/reports/stats', { params })
  },

  // Report a job
  reportJob: (jobId, reportData) => {
    return api.post(`/reports/job/${jobId}`, reportData)
  },

  // Report a user
  reportUser: (userId, reportData) => {
    return api.post(`/reports/user/${userId}`, reportData)
  },

  // Report a company
  reportCompany: (companyId, reportData) => {
    return api.post(`/reports/company/${companyId}`, reportData)
  },

  // Report a message
  reportMessage: (messageId, reportData) => {
    return api.post(`/reports/message/${messageId}`, reportData)
  },
}

export default reportApi
