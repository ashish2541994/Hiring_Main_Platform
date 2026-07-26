import api from "./api";

const applicationApi = {
  getApplications: (params = {}) => api.get("/applications", { params }),
  getMyApplications: (params = {}) => api.get("/applications/my", { params }),
  getJobApplicants: (jobId, params = {}) =>
    api.get(`/applications/job/${jobId}/applicants`, { params }),
  createApplication: (applicationData) =>
    api.post("/applications", applicationData),
  updateApplication: (id, data) => api.patch(`/applications/${id}`, data),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
};

export default applicationApi;
