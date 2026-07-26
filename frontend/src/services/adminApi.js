import api from "./api";

const adminApi = {
  // Get platform statistics
  getStats: () => {
    return api.get("/admin/stats");
  },

  // Get analytics data
  getAnalytics: (params = {}) => {
    return api.get("/admin/analytics", { params });
  },

  // Get all users
  getUsers: (params = {}) => {
    return api.get("/admin/users", { params });
  },

  // Get user by ID
  getUserById: (userId) => {
    return api.get(`/admin/users/${userId}`);
  },

  // Update user
  updateUser: (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData);
  },

  // Delete user
  deleteUser: (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  // Activate user
  activateUser: (userId) => {
    return api.put(`/admin/users/${userId}/status`, { isActive: true });
  },

  // Deactivate user
  deactivateUser: (userId) => {
    return api.put(`/admin/users/${userId}/status`, { isActive: false });
  },

  // Verify user
  verifyUser: (userId) => {
    return api.put(`/admin/users/${userId}/verify`);
  },

  // Get all jobs
  getAllJobs: (params = {}) => {
    return api.get("/admin/jobs", { params });
  },

  // Get job by ID
  getJobById: (jobId) => {
    return api.get(`/admin/jobs/${jobId}`);
  },

  // Delete job
  deleteJob: (jobId) => {
    return api.delete(`/admin/jobs/${jobId}`);
  },

  // Get all companies
  getAllCompanies: (params = {}) => {
    return api.get("/admin/companies", { params });
  },

  // Get company by ID
  getCompanyById: (companyId) => {
    return api.get(`/admin/companies/${companyId}`);
  },

  // Update company
  updateCompany: (companyId, companyData) => {
    return api.put(`/admin/companies/${companyId}`, companyData);
  },

  // Delete company
  deleteCompany: (companyId) => {
    return api.delete(`/admin/companies/${companyId}`);
  },

  // Get all applications
  getAllApplications: (params = {}) => {
    return api.get("/admin/applications", { params });
  },

  // Get candidate complete profile
  getCandidateProfile: (candidateId) => {
    return api.get(`/admin/candidate/${candidateId}`);
  },

  // Get candidate applications
  getCandidateApplications: (candidateId, params = {}) => {
    return api.get(`/admin/candidate/${candidateId}/applications`, { params });
  },

  // Get application by ID
  getApplicationById: (applicationId) => {
    return api.get(`/admin/applications/${applicationId}`);
  },

  // Get reports
  getReports: (params = {}) => {
    return api.get("/admin/reports", { params });
  },

  // Get report by ID
  getReportById: (reportId) => {
    return api.get(`/admin/reports/${reportId}`);
  },

  // Resolve report
  resolveReport: (reportId, resolutionData) => {
    return api.put(`/admin/reports/${reportId}/resolve`, resolutionData);
  },

  // Get system settings
  getSettings: () => {
    return api.get("/admin/settings");
  },

  // Update system settings
  updateSettings: (settingsData) => {
    return api.put("/admin/settings", settingsData);
  },

  // Get activity logs
  getActivityLogs: (params = {}) => {
    return api.get("/admin/activity-logs", { params });
  },

  // Export data
  exportData: (type, params = {}) => {
    return api.get(`/admin/export/${type}`, {
      params,
      responseType: "blob",
    });
  },
};

export default adminApi;
