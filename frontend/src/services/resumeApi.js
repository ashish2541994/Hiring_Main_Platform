import api from "./api";

const resumeApi = {
  getResumes: (params = {}) => {
    return api.get("/resumes", { params });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteResume: (id) => {
    return api.delete(`/resumes/${id}`);
  },
};

export default resumeApi;
