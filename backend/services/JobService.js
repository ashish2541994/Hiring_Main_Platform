import JobRepository from "../repositories/JobRepository.js";
import ApplicationRepository from "../repositories/ApplicationRepository.js";

class JobService {
  async createJob(jobData, userId) {
    const job = await JobRepository.create({
      ...jobData,
      postedBy: userId,
    });

    return job;
  }

  async updateJob(jobId, updateData, userId) {
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (
      existingJob.postedBy._id?.toString() !== userId.toString() &&
      existingJob.postedBy.toString() !== userId.toString()
    ) {
      throw new Error("Unauthorized to update this job");
    }

    const updatedJob = await JobRepository.update(jobId, updateData);
    return updatedJob;
  }

  async deleteJob(jobId, userId) {
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    if (
      existingJob.postedBy._id?.toString() !== userId.toString() &&
      existingJob.postedBy.toString() !== userId.toString()
    ) {
      throw new Error("Unauthorized to delete this job");
    }

    await JobRepository.delete(jobId);
    return { success: true };
  }

  async getJobById(jobId) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Increment view count
    await JobRepository.update(jobId, { $inc: { viewCount: 1 } });

    return job;
  }

  async getJobs(filters = {}, options = {}) {
    return await JobRepository.findAll(filters, options);
  }

  async searchJobs(query, filters = {}, options = {}) {
    return await JobRepository.search(query, filters, options);
  }

  async getSimilarJobs(jobId, limit = 5) {
    return await JobRepository.getSimilarJobs(jobId, limit);
  }

  async getJobStatistics(jobId, userId) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    if (
      job.postedBy._id?.toString() !== userId.toString() &&
      job.postedBy.toString() !== userId.toString()
    ) {
      throw new Error("Unauthorized to view job statistics");
    }

    return await JobRepository.getJobStatistics(jobId);
  }

  async applyToJob(jobId, candidate, applicationData) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    if (job.status !== "active") {
      throw new Error("Job is no longer active");
    }

    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      throw new Error("Job application deadline has passed");
    }

    const existingApplication =
      await ApplicationRepository.checkExistingApplication(candidate, jobId);

    if (existingApplication) {
      throw new Error("You have already applied to this job");
    }

    const application = await ApplicationRepository.create({
      job: jobId,
      candidate,
      company: job.company,
      recruiter: job.postedBy,
      ...applicationData,
      status: "pending",
    });

    return application;
  }

  async saveJob(jobId, candidateId) {
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    return { success: true };
  }

  async getJobsByRecruiter(userId, filters = {}, options = {}) {
    return await JobRepository.findByRecruiter(
      userId,
      { ...filters, postedBy: userId },
      options,
    );
  }

  async getJobsByCompany(company, filters = {}, options = {}) {
    return await JobRepository.findByCompany(
      company,
      { ...filters, company },
      options,
    );
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);
  }
}

export default new JobService();
