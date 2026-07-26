import { companyApi } from "./index";
import toast from "react-hot-toast";

class CompanyService {
  // Get current user's company
  async getMyCompany() {
    try {
      const response = await companyApi.getMyCompany();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      // 404 means no company profile yet — not an error
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: "No company profile found",
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch company",
      };
    }
  }

  // Get all companies
  async getCompanies(filters = {}) {
    try {
      const response = await companyApi.getCompanies(filters);
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

  // Get company by ID
  async getCompanyById(companyId) {
    try {
      const response = await companyApi.getCompanyById(companyId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch company",
      };
    }
  }

  // Get company by slug
  async getCompanyBySlug(slug) {
    try {
      const response = await companyApi.getCompanyBySlug(slug);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch company",
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
      toast.error(error.response?.data?.message || "Failed to create company");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create company",
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
  async uploadLogo(companyId, file) {
    try {
      // Validate file
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a JPEG, PNG, or WebP image");
        return {
          success: false,
          error: "Invalid file type",
        };
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 2MB");
        return {
          success: false,
          error: "File too large",
        };
      }

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

  // Get company jobs
  async getCompanyJobs(companyId, filters = {}) {
    try {
      const response = await companyApi.getCompanyJobs(companyId, filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch company jobs",
      };
    }
  }

  // Get company reviews
  async getCompanyReviews(companyId, filters = {}) {
    try {
      const response = await companyApi.getReviews(companyId, filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch reviews",
      };
    }
  }

  // Add company review
  async addReview(companyId, reviewData) {
    try {
      // Validate review data
      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        toast.error("Please provide a valid rating (1-5)");
        return {
          success: false,
          error: "Invalid rating",
        };
      }

      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        toast.error("Please provide a review comment");
        return {
          success: false,
          error: "Invalid comment",
        };
      }

      const response = await companyApi.addReview(companyId, reviewData);
      toast.success("Review submitted");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      toast.error("Failed to submit review");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to submit review",
      };
    }
  }

  // Follow company
  async followCompany(companyId) {
    try {
      await companyApi.followCompany(companyId);
      toast.success("Company followed");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to follow company");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to follow company",
      };
    }
  }

  // Unfollow company
  async unfollowCompany(companyId) {
    try {
      await companyApi.unfollowCompany(companyId);
      toast.success("Unfollowed company");
      return {
        success: true,
      };
    } catch (error) {
      toast.error("Failed to unfollow company");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to unfollow company",
      };
    }
  }

  // Search companies
  async searchCompanies(query, filters = {}) {
    try {
      const response = await companyApi.searchCompanies(query, filters);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Search failed",
      };
    }
  }
}

export default new CompanyService();
