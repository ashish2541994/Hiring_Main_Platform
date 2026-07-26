import Job from "../models/Job.js";
import Application from "../models/Application.js";

class JobRepository {
  async findById(id) {
    return await Job.findById(id).populate("company postedBy");
  }

  async findBySlug(slug) {
    return await Job.findOne({ slug }).populate("company postedBy");
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const query = this._buildQuery(filters);
    const jobs = await Job.find(query)
      .populate("company postedBy")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    return { jobs, total, page, limit };
  }

  async create(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  async update(id, updateData) {
    return await Job.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("company postedBy");
  }

  async delete(id) {
    return await Job.findByIdAndDelete(id);
  }

  async findByCompany(company, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ company })
      .populate("postedBy", "firstName lastName email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ company });

    return { jobs, total, page, limit };
  }

  async findByRecruiter(postedBy, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ postedBy })
      .populate("company", "name logo")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ postedBy });

    return { jobs, total, page, limit };
  }

  async search(query, filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");
    const searchQuery = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { requirements: searchRegex },
        { skills: { $in: [searchRegex] } },
      ],
    };

    const filterQuery = this._buildQuery(filters);
    const finalQuery = { ...searchQuery, ...filterQuery };

    const jobs = await Job.find(finalQuery)
      .populate("company postedBy")
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(finalQuery);

    return { jobs, total, page, limit };
  }

  async getSimilarJobs(jobId, limit = 5) {
    const job = await Job.findById(jobId);
    if (!job) return [];

    const similarJobs = await Job.find({
      _id: { $ne: jobId },
      $or: [
        { type: job.type },
        { experienceLevel: job.experienceLevel },
        { skills: { $in: job.skills } },
      ],
    })
      .populate("company postedBy")
      .limit(limit);

    return similarJobs;
  }

  async getJobStatistics(jobId) {
    const totalApplications = await Application.countDocuments({ job: jobId });
    const pendingApplications = await Application.countDocuments({
      job: jobId,
      status: "pending",
    });
    const reviewedApplications = await Application.countDocuments({
      job: jobId,
      status: "reviewed",
    });
    const shortlistedApplications = await Application.countDocuments({
      job: jobId,
      status: "shortlisted",
    });
    const interviewingApplications = await Application.countDocuments({
      job: jobId,
      status: "interviewing",
    });
    const offeredApplications = await Application.countDocuments({
      job: jobId,
      status: "offered",
    });
    const hiredApplications = await Application.countDocuments({
      job: jobId,
      status: "hired",
    });
    const rejectedApplications = await Application.countDocuments({
      job: jobId,
      status: "rejected",
    });
    const withdrawnApplications = await Application.countDocuments({
      job: jobId,
      status: "withdrawn",
    });

    return {
      totalApplications,
      pendingApplications,
      reviewedApplications,
      shortlistedApplications,
      interviewingApplications,
      offeredApplications,
      hiredApplications,
      rejectedApplications,
      withdrawnApplications,
    };
  }

  _buildQuery(filters) {
    const query = {};

    if (filters.company) {
      query.company = filters.company;
    }

    if (filters.postedBy) {
      query.postedBy = filters.postedBy;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    if (filters.location) {
      query.location = new RegExp(filters.location, "i");
    }

    if (filters.remote !== undefined) {
      query.remote = filters.remote;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.salaryMin) {
      query.salaryMin = { $gte: filters.salaryMin };
    }

    if (filters.salaryMax) {
      query.salaryMax = { $lte: filters.salaryMax };
    }

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    if (filters.deadlineStart || filters.deadlineEnd) {
      query.expiresAt = {};
      if (filters.deadlineStart) {
        query.expiresAt.$gte = new Date(filters.deadlineStart);
      }
      if (filters.deadlineEnd) {
        query.expiresAt.$lte = new Date(filters.deadlineEnd);
      }
    }

    return query;
  }
}

export default new JobRepository();
