import api from "./api";

const candidateApi = {
  // Get candidate profile
  getProfile: () => {
    return api.get("/candidate/profile");
  },

  // Update candidate profile
  updateProfile: (profileData) => {
    return api.put("/candidate/profile", profileData);
  },

  // Upload resume - use the dedicated resume upload endpoint
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get resumes list
  getResumes: () => {
    return api.get("/resumes");
  },

  // Delete resume by id
  deleteResume: (id) => {
    return api.delete(`/resumes/${id}`);
  },

  // Get candidate applications - uses the applications/my endpoint
  getApplications: (params = {}) => {
    return api.get("/applications/my", { params });
  },

  // Get application by ID
  getApplicationById: (applicationId) => {
    return api.get(`/applications/${applicationId}`);
  },

  // Withdraw application
  withdrawApplication: (applicationId) => {
    return api.delete(`/applications/${applicationId}`);
  },

  // Get saved jobs
  getSavedJobs: (params = {}) => {
    return api.get("/saved-jobs", { params });
  },

  // Get candidate skills - embedded in profile
  getSkills: () => {
    return api.get("/candidate/profile");
  },

  // Add skill - uses profile update
  addSkill: (skill) => {
    return api.put("/candidate/profile", { skills: [skill] });
  },

  // Remove skill - uses profile update
  removeSkill: (skillId) => {
    return api.put("/candidate/profile", { skills: [skillId] });
  },

  // Get candidate education - embedded in profile
  getEducation: () => {
    return api.get("/candidate/profile");
  },

  // Add education - uses profile update
  addEducation: (educationData) => {
    return api.put("/candidate/profile", { education: [educationData] });
  },

  // Update education - uses profile update
  updateEducation: (educationId, educationData) => {
    return api.put("/candidate/profile", { education: [educationData] });
  },

  // Delete education - uses profile update
  deleteEducation: (educationId) => {
    return api.put("/candidate/profile", { education: [] });
  },

  // Get profile completion percentage
  getProfileCompletion: () => {
    return api.get("/candidate/profile");
  },

  // ====== Recruiter-facing candidate profile methods ======

  // Get candidate profile by ID (for recruiter viewing)
  getCandidateProfile: (candidateId) => {
    return api.get(`/candidate/${candidateId}/profile`);
  },

  // Get candidate resume file (for recruiter viewing/downloading)
  getCandidateResume: (candidateId) => {
    return api.get(`/candidate/${candidateId}/resume`, {
      responseType: "blob",
    });
  },

  // Get applicants for a specific job
  getJobApplicants: (jobId, params = {}) => {
    return api.get(`/applications/job/${jobId}/applicants`, { params });
  },
};

export default candidateApi;
