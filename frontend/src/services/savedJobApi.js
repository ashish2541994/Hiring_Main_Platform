import api from "./api";

const savedJobApi = {
  getSavedJobs: (params = {}) => {
    return api.get("/saved-jobs", { params });
  },
  saveJob: (jobId) => {
    return api.post(`/saved-jobs/${jobId}`);
  },
  unsaveJob: (jobId) => {
    return api.delete(`/saved-jobs/${jobId}`);
  },
  checkSaved: (jobId) => {
    return api.get(`/saved-jobs/check/${jobId}`);
  },
};

export default savedJobApi;
