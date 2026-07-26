import Application from "../models/Application.js";
import Job from "../models/Job.js";

class ApplicationRepository {
  async findById(id) {
    return await Application.findById(id).populate(
      "job candidate company recruiter",
    );
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const query = await this._buildQuery(filters);
    const applications = await Application.find(query)
      .populate("job candidate company recruiter")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(query);

    return { applications, total, page, limit };
  }

  async create(applicationData) {
    const application = new Application(applicationData);
    return await application.save();
  }

  async update(id, updateData) {
    return await Application.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("job candidate company recruiter");
  }

  async delete(id) {
    return await Application.findByIdAndDelete(id);
  }

  async findByCandidate(candidate, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ candidate })
      .populate({
        path: "job",
        select: "title company location type salary status",
        populate: { path: "company", select: "name logo" },
      })
      .populate("company", "name logo")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({ candidate });

    return { applications, total, page, limit };
  }

  async findByJob(job, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ job })
      .populate(
        "candidate",
        "firstName lastName email avatar skills experience education phone location",
      )
      .populate("company", "name logo")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({ job });

    return { applications, total, page, limit };
  }

  async findByStatus(status, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ status })
      .populate("job candidate company recruiter")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({ status });

    return { applications, total, page, limit };
  }

  async checkExistingApplication(candidate, job) {
    return await Application.findOne({ candidate, job });
  }

  async updateStatus(id, status) {
    return await Application.findByIdAndUpdate(
      id,
      {
        $set: { status },
        $push: {
          timeline: {
            status,
            note: `Status changed to ${status}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true },
    ).populate("job candidate company recruiter");
  }

  async updateNotes(id, notes) {
    return await Application.findByIdAndUpdate(
      id,
      { $set: { notes, updatedAt: new Date() } },
      { new: true },
    ).populate("job candidate company recruiter");
  }

  async getStatistics(filters = {}) {
    const query = await this._buildQuery(filters);

    const total = await Application.countDocuments(query);
    const pending = await Application.countDocuments({
      ...query,
      status: "pending",
    });
    const reviewed = await Application.countDocuments({
      ...query,
      status: "reviewed",
    });
    const shortlisted = await Application.countDocuments({
      ...query,
      status: "shortlisted",
    });
    const interviewing = await Application.countDocuments({
      ...query,
      status: "interviewing",
    });
    const offered = await Application.countDocuments({
      ...query,
      status: "offered",
    });
    const hired = await Application.countDocuments({
      ...query,
      status: "hired",
    });
    const rejected = await Application.countDocuments({
      ...query,
      status: "rejected",
    });
    const withdrawn = await Application.countDocuments({
      ...query,
      status: "withdrawn",
    });

    return {
      total,
      pending,
      reviewed,
      shortlisted,
      interviewing,
      offered,
      hired,
      rejected,
      withdrawn,
    };
  }

  async _buildQuery(filters) {
    const query = {};

    if (filters.candidate) {
      query.candidate = filters.candidate;
    }

    if (filters.job) {
      query.job = filters.job;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.companyId) {
      const jobs = await Job.find({ company: filters.companyId }).select("_id");
      query.job = { $in: jobs.map((job) => job._id) };
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

    if (filters.updatedStart || filters.updatedEnd) {
      query.updatedAt = {};
      if (filters.updatedStart) {
        query.updatedAt.$gte = new Date(filters.updatedStart);
      }
      if (filters.updatedEnd) {
        query.updatedAt.$lte = new Date(filters.updatedEnd);
      }
    }

    return query;
  }
}

export default new ApplicationRepository();
