import api from "./api";

const companyApi = {
  // Get all companies
  getCompanies: (params = {}) => {
    return api.get("/companies", { params });
  },

  // Get current user's company
  getMyCompany: () => {
    return api.get("/companies/my");
  },

  // Get company by ID
  getCompanyById: (id) => {
    return api.get(`/companies/${id}`);
  },

  // Get company by slug
  getCompanyBySlug: (slug) => {
    return api.get(`/companies/slug/${slug}`);
  },

  // Create company (recruiter)
  createCompany: (companyData) => {
    return api.post("/companies", companyData);
  },

  // Update company (recruiter)
  updateCompany: (id, companyData) => {
    return api.put(`/companies/${id}`, companyData);
  },

  // Upload company logo
  uploadLogo: (companyId, file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return api.post(`/companies/${companyId}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get company jobs
  getCompanyJobs: (companyId, params = {}) => {
    return api.get(`/companies/${companyId}/jobs`, { params });
  },

  // Get company team members
  getTeamMembers: (companyId, params = {}) => {
    return api.get(`/companies/${companyId}/team`, { params });
  },

  // Add team member (admin)
  addTeamMember: (companyId, memberData) => {
    return api.post(`/companies/${companyId}/team`, memberData);
  },

  // Remove team member (admin)
  removeTeamMember: (companyId, memberId) => {
    return api.delete(`/companies/${companyId}/team/${memberId}`);
  },

  // Update team member role (admin)
  updateTeamMemberRole: (companyId, memberId, role) => {
    return api.put(`/companies/${companyId}/team/${memberId}`, { role });
  },

  // Follow company (candidate)
  followCompany: (companyId) => {
    return api.post(`/companies/${companyId}/follow`);
  },

  // Unfollow company (candidate)
  unfollowCompany: (companyId) => {
    return api.delete(`/companies/${companyId}/follow`);
  },

  // Get followed companies (candidate)
  getFollowedCompanies: (params = {}) => {
    return api.get("/companies/followed", { params });
  },

  // Get company reviews
  getReviews: (companyId, params = {}) => {
    return api.get(`/companies/${companyId}/reviews`, { params });
  },

  // Add company review (candidate)
  addReview: (companyId, reviewData) => {
    return api.post(`/companies/${companyId}/reviews`, reviewData);
  },

  // Update company review
  updateReview: (reviewId, reviewData) => {
    return api.put(`/companies/reviews/${reviewId}`, reviewData);
  },

  // Delete company review
  deleteReview: (reviewId) => {
    return api.delete(`/companies/reviews/${reviewId}`);
  },

  // Search companies
  searchCompanies: (query, filters = {}) => {
    return api.get("/companies/search", { params: { q: query, ...filters } });
  },
};

export default companyApi;
