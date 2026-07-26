import { candidateApi } from "./index";
import toast from "react-hot-toast";

class CandidateService {
  // Get candidate profile
  async getProfile() {
    try {
      const response = await candidateApi.getProfile();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch profile",
      };
    }
  }

  // Update candidate profile
  async updateProfile(profileData) {
    try {
      const response = await candidateApi.updateProfile(profileData);
      toast.success("Profile updated successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update profile");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    }
  }

  // Upload resume
  async uploadResume(file) {
    try {
      // Validate file
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return {
          success: false,
          error: "Invalid file type",
        };
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return {
          success: false,
          error: "File too large",
        };
      }

      const response = await candidateApi.uploadResume(file);
      toast.success("Resume uploaded successfully");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to upload resume");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to upload resume",
      };
    }
  }

  // Get applications
  async getApplications(filters = {}) {
    try {
      const response = await candidateApi.getApplications(filters);
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

  // Withdraw application
  async withdrawApplication(applicationId) {
    try {
      await candidateApi.withdrawApplication(applicationId);
      toast.success("Application withdrawn");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to withdraw application");
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to withdraw application",
      };
    }
  }

  // Add skill
  async addSkill(skill) {
    try {
      if (!skill || skill.trim().length === 0) {
        toast.error("Please enter a valid skill");
        return {
          success: false,
          error: "Invalid skill",
        };
      }

      const response = await candidateApi.addSkill(skill.trim());
      toast.success("Skill added");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to add skill");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add skill",
      };
    }
  }

  // Remove skill
  async removeSkill(skillId) {
    try {
      await candidateApi.removeSkill(skillId);
      toast.success("Skill removed");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to remove skill");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to remove skill",
      };
    }
  }

  // Add education
  async addEducation(educationData) {
    try {
      const requiredFields = ["school", "degree", "field"];
      const missingFields = requiredFields.filter(
        (field) => !educationData[field],
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return {
          success: false,
          error: "Validation failed",
        };
      }

      const response = await candidateApi.addEducation(educationData);
      toast.success("Education added");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to add education");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add education",
      };
    }
  }

  // Update education
  async updateEducation(educationId, educationData) {
    try {
      const response = await candidateApi.updateEducation(
        educationId,
        educationData,
      );
      toast.success("Education updated");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to update education");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update education",
      };
    }
  }

  // Delete education
  async deleteEducation(educationId) {
    try {
      await candidateApi.deleteEducation(educationId);
      toast.success("Education deleted");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to delete education");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete education",
      };
    }
  }

  // Get profile completion
  async getProfileCompletion() {
    try {
      const response = await candidateApi.getProfileCompletion();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch profile completion",
      };
    }
  }
}

export default new CandidateService();
