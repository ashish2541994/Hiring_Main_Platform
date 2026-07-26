import ApplicationRepository from "../repositories/ApplicationRepository.js";
import JobRepository from "../repositories/JobRepository.js";
import UserRepository from "../repositories/UserRepository.js";

class ApplicationService {
  async getApplicationById(applicationId) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }
    return application;
  }

  async getApplicationsByCandidate(candidate, filters = {}, options = {}) {
    return await ApplicationRepository.findByCandidate(candidate, options);
  }

  async getApplicationsByJob(jobId, userId, filters = {}, options = {}) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Check if user is the owner of the job or admin
    if (job.postedBy && job.postedBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to view applications for this job");
    }

    return await ApplicationRepository.findByJob(jobId, options);
  }

  async updateApplicationStatus(applicationId, status, userId) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Check authorization by job ownership
    if (application.job && application.job.postedBy) {
      if (application.job.postedBy.toString() !== userId.toString()) {
        throw new Error("Unauthorized to update this application");
      }
    } else {
      // Fallback: check via job repository
      const job = await JobRepository.findById(application.job);
      if (
        job &&
        job.postedBy &&
        job.postedBy.toString() !== userId.toString()
      ) {
        throw new Error("Unauthorized to update this application");
      }
    }

    const validStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "interviewing",
      "offered",
      "hired",
      "rejected",
      "withdrawn",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const updatedApplication = await ApplicationRepository.updateStatus(
      applicationId,
      status,
    );
    return updatedApplication;
  }

  async updateApplicationNotes(applicationId, notes, userId) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Check authorization
    if (application.job && application.job.postedBy) {
      if (application.job.postedBy.toString() !== userId.toString()) {
        throw new Error("Unauthorized to update this application");
      }
    }

    const updatedApplication = await ApplicationRepository.updateNotes(
      applicationId,
      notes,
    );
    return updatedApplication;
  }

  async withdrawApplication(applicationId, candidate) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.candidate._id.toString() !== candidate.toString()) {
      throw new Error("Unauthorized to withdraw this application");
    }

    if (application.status === "hired" || application.status === "rejected") {
      throw new Error("Cannot withdraw application in final status");
    }

    // Mark as withdrawn instead of deleting
    const updated = await ApplicationRepository.updateStatus(
      applicationId,
      "withdrawn",
    );
    return { success: true, application: updated };
  }

  async getApplicationStatistics(filters = {}) {
    return await ApplicationRepository.getStatistics(filters);
  }

  async getApplicationStatisticsByJob(jobId, userId) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    if (job.postedBy && job.postedBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to view statistics for this job");
    }

    return await ApplicationRepository.getStatistics({ job: jobId });
  }

  async getApplicationStatisticsByCandidate(candidate) {
    return await ApplicationRepository.getStatistics({ candidate });
  }

  async getApplicationsByStatus(status, options = {}) {
    return await ApplicationRepository.findByStatus(status, options);
  }

  async getAllApplications(filters = {}, options = {}) {
    return await ApplicationRepository.findAll(filters, options);
  }
}

export default new ApplicationService();
