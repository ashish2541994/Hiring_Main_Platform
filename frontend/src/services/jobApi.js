import api from "./api";

const jobApi = {
  // Get all jobs with filters and pagination
  getJobs: (params = {}) => {
    return api.get("/jobs", { params });
  },

  // Get recruiter's own jobs
  getMyJobs: (params = {}) => {
    return api.get("/jobs/my-jobs", { params });
  },

  // Get job by ID
  getJobById: (id) => {
    return api.get(`/jobs/${id}`);
  },

  // Get job by slug - uses the same getJobById since we only have ID route
  getJobBySlug: (slug) => {
    return api.get(`/jobs/${slug}`);
  },

  // Create new job (recruiter only)
  createJob: (jobData) => {
    return api.post("/jobs", jobData);
  },

  // Update job (recruiter only)
  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },

  // Delete job (recruiter only)
  deleteJob: (id) => {
    return api.delete(`/jobs/${id}`);
  },

  // Update job status (publish/close/draft)
  updateJobStatus: (id, status) => {
    return api.patch(`/jobs/${id}/status`, { status });
  },

  // Get dashboard statistics for recruiter
  getDashboardStats: () => {
    return api.get("/jobs/dashboard-stats");
  },

  // Get jobs by company - uses the /jobs endpoint with company filter
  getJobsByCompany: (companyId, params = {}) => {
    return api.get("/jobs", { params: { ...params, company: companyId } });
  },

  // Get jobs by recruiter - uses /my-jobs endpoint
  getJobsByRecruiter: (recruiterId, params = {}) => {
    return api.get("/jobs/my-jobs", { params });
  },

  // Search jobs - uses the /jobs endpoint with search query param
  searchJobs: (query, filters = {}) => {
    return api.get("/jobs", { params: { search: query, ...filters } });
  },

  // Get similar jobs - fetches all jobs and filters by category
  getSimilarJobs: (jobId, limit = 5) => {
    return api.get("/jobs", { params: { limit } });
  },

  // Get job statistics (recruiter) - uses the /jobs/:id route which returns job data
  getJobStats: (jobId) => {
    return api.get(`/jobs/${jobId}`);
  },
};

export default jobApi;
