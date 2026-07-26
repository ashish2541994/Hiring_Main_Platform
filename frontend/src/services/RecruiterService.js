import { jobApi, companyApi, applicationApi } from "./index";
import toast from "react-hot-toast";

class RecruiterService {
  // Get recruiter's dashboard statistics
  async getDashboardStats() {
    try {
      const response = await jobApi.getDashboardStats();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch statistics",
      };
    }
  }

  // Get recruiter's jobs with search, filter, pagination
  async getMyJobs(params = {}) {
    try {
      const response = await jobApi.getMyJobs(params);
      return {
        success: true,
        data: response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      toast.error("Failed to fetch jobs");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch jobs",
      };
    }
  }

  // Create job with validation
  async createJob(jobData) {
    try {
      const response = await jobApi.createJob(jobData);
      toast.success("Job created successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create job");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create job",
      };
    }
  }

  // Update job
  async updateJob(jobId, jobData) {
    try {
      const response = await jobApi.updateJob(jobId, jobData);
      toast.success("Job updated successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update job");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update job",
      };
    }
  }

  // Delete job
  async deleteJob(jobId) {
    try {
      await jobApi.deleteJob(jobId);
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

  // Update job status (publish/close/draft)
  async updateJobStatus(jobId, status) {
    try {
      const response = await jobApi.updateJobStatus(jobId, status);
      toast.success(
        `Job ${status === "active" ? "published" : status} successfully`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update job status");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update job status",
      };
    }
  }

  // Get applications for recruiter's jobs
  async getApplications(params = {}) {
    try {
      const response = await applicationApi.getApplications(params);
      return {
        success: true,
        data: response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      toast.error("Failed to fetch applications");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch applications",
      };
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await applicationApi.updateApplication(applicationId, {
        status,
      });
      toast.success("Application status updated");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update application status");
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to update application status",
      };
    }
  }

  // Get current user's company
  async getMyCompany() {
    try {
      const response = await companyApi.getMyCompany();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: false, data: null };
      }
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch company profile",
      };
    }
  }

  // Create company
  async createCompany(companyData) {
    try {
      const response = await companyApi.createCompany(companyData);
      toast.success("Company created successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create company";
      toast.error(msg);
      return {
        success: false,
        error: msg,
        field: error.response?.data?.field,
      };
    }
  }

  // Update company
  async updateCompany(companyId, companyData) {
    try {
      const response = await companyApi.updateCompany(companyId, companyData);
      toast.success("Company updated successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update company";
      toast.error(msg);
      return {
        success: false,
        error: msg,
        field: error.response?.data?.field,
      };
    }
  }

  // Upload company logo
  async uploadCompanyLogo(companyId, file) {
    try {
      const response = await companyApi.uploadLogo(companyId, file);
      toast.success("Logo uploaded successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to upload logo");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to upload logo",
      };
    }
  }
}

export default new RecruiterService();
