import applicationApi from "./applicationApi";
import toast from "react-hot-toast";

class ApplicationService {
  async getApplications(params = {}) {
    try {
      const response = await applicationApi.getApplications(params);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch applications",
      };
    }
  }

  async getMyApplications(params = {}) {
    try {
      const response = await applicationApi.getMyApplications(params);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch applications",
      };
    }
  }

  async createApplication(job, coverLetter = "", candidateData = {}) {
    try {
      const payload = {
        job,
        coverLetter,
        ...candidateData,
      };
      const response = await applicationApi.createApplication(payload);
      toast.success("Application submitted successfully");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to submit application",
      };
    }
  }

  async updateApplication(id, data) {
    try {
      const response = await applicationApi.updateApplication(id, data);
      toast.success("Application updated successfully");
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update application",
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update application",
      };
    }
  }

  async withdrawApplication(id) {
    try {
      await applicationApi.withdrawApplication(id);
      toast.success("Application withdrawn");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to withdraw application",
      );
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to withdraw application",
      };
    }
  }
}

export default new ApplicationService();
