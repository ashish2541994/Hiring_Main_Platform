import { adminApi } from "./index";
import toast from "react-hot-toast";

class AdminService {
  // Get platform statistics
  async getStats() {
    try {
      const response = await adminApi.getStats();
      return {
        success: response.data.success,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch statistics",
      };
    }
  }

  // Get analytics data
  async getAnalytics(params = {}) {
    try {
      const response = await adminApi.getAnalytics(params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch analytics",
      };
    }
  }

  // Get all users
  async getUsers(filters = {}) {
    try {
      const response = await adminApi.getUsers(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch users",
      };
    }
  }

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await adminApi.updateUser(userId, userData);
      toast.success("User updated successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update user");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update user",
      };
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      await adminApi.deleteUser(userId);
      toast.success("User deleted successfully");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to delete user");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete user",
      };
    }
  }

  // Activate user
  async activateUser(userId) {
    try {
      await adminApi.activateUser(userId);
      toast.success("User activated");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to activate user");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to activate user",
      };
    }
  }

  // Deactivate user
  async deactivateUser(userId) {
    try {
      await adminApi.deactivateUser(userId);
      toast.success("User deactivated");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to deactivate user");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to deactivate user",
      };
    }
  }

  // Verify user
  async verifyUser(userId) {
    try {
      await adminApi.verifyUser(userId);
      toast.success("User verified");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to verify user");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to verify user",
      };
    }
  }

  // Get all jobs
  async getAllJobs(filters = {}) {
    try {
      const response = await adminApi.getAllJobs(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch jobs",
      };
    }
  }

  // Delete job
  async deleteJob(jobId) {
    try {
      await adminApi.deleteJob(jobId);
      toast.success("Job deleted successfully");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to delete job");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete job",
      };
    }
  }

  // Get all companies
  async getAllCompanies(filters = {}) {
    try {
      const response = await adminApi.getAllCompanies(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch companies",
      };
    }
  }

  // Delete company
  async deleteCompany(companyId) {
    try {
      await adminApi.deleteCompany(companyId);
      toast.success("Company deleted successfully");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to delete company");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete company",
      };
    }
  }

  // Get all applications
  async getAllApplications(filters = {}) {
    try {
      const response = await adminApi.getAllApplications(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch applications",
      };
    }
  }

  // Get candidate complete profile
  async getCandidateProfile(candidateId) {
    try {
      const response = await adminApi.getCandidateProfile(candidateId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch candidate profile",
      };
    }
  }

  // Get candidate applications
  async getCandidateApplications(candidateId, params = {}) {
    try {
      const response = await adminApi.getCandidateApplications(
        candidateId,
        params,
      );
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to fetch candidate applications",
      };
    }
  }

  // Get reports
  async getReports(filters = {}) {
    try {
      const response = await adminApi.getReports(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch reports",
      };
    }
  }

  // Resolve report
  async resolveReport(reportId, resolutionData) {
    try {
      await adminApi.resolveReport(reportId, resolutionData);
      toast.success("Report resolved");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to resolve report");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to resolve report",
      };
    }
  }

  // Get system settings
  async getSettings() {
    try {
      const response = await adminApi.getSettings();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch settings",
      };
    }
  }

  // Update system settings
  async updateSettings(settingsData) {
    try {
      const response = await adminApi.updateSettings(settingsData);
      toast.success("Settings updated");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update settings");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update settings",
      };
    }
  }

  // Get activity logs
  async getActivityLogs(filters = {}) {
    try {
      const response = await adminApi.getActivityLogs(filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch activity logs",
      };
    }
  }

  // Export data
  async exportData(type, params = {}) {
    try {
      const response = await adminApi.exportData(type, params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to export data");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to export data",
      };
    }
  }
}

export default new AdminService();
