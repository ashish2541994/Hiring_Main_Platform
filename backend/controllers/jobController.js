import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      experienceLevel,
      location,
      category,
      remote,
      salaryMin,
      salaryMax,
      country,
      state,
      city,
      industry,
      skill,
      postedDate,
      sortBy,
    } = req.query;

    const query = {
      status: "active",
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (type) query.type = type;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = category;
    if (industry) query.category = industry; // use category as industry filter
    if (remote) query["location.type"] = remote;
    if (country) query["location.country"] = { $regex: country, $options: "i" };
    if (state) query["location.state"] = { $regex: state, $options: "i" };
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (skill) query.skills = { $in: [new RegExp(skill, "i")] };

    if (location) {
      query.$or = query.$or || [];
      query.$or.push(
        { "location.city": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
      );
    }

    if (salaryMin) query["salary.min"] = { $gte: parseInt(salaryMin) };
    if (salaryMax) query["salary.max"] = { $lte: parseInt(salaryMax) };

    // Posted date filter
    if (postedDate) {
      const now = new Date();
      let dateFilter;
      switch (postedDate) {
        case "24h":
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "3d":
          dateFilter = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
          break;
        case "7d":
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "14d":
          dateFilter = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      if (dateFilter) query.createdAt = { $gte: dateFilter };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    switch (sortBy) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "highest_salary":
        sortOption = { "salary.max": -1 };
        break;
      case "lowest_salary":
        sortOption = { "salary.min": 1 };
        break;
      case "most_relevant":
        sortOption = { featured: -1, viewCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo industry location")
        .populate("postedBy", "firstName lastName avatar")
        .sort(sortOption)
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status: statusFilter } = req.query;
    const query = req.user.role === "admin" ? {} : { postedBy: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (statusFilter) query.status = statusFilter;

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo")
        .populate("postedBy", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo industry location description website")
      .populate("postedBy", "firstName lastName avatar");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Increment view count
    job.viewCount += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, postedBy: req.user._id };

    // Handle companyName — find existing Company by name or create a new one
    const companyName = jobData.companyName;
    if (companyName && typeof companyName === "string" && companyName.trim()) {
      const trimmedName = companyName.trim();
      let company = await Company.findOne({
        name: {
          $regex: new RegExp(
            `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        },
      });
      if (!company) {
        company = await Company.create({
          name: trimmedName,
          owners: [req.user._id],
        });
      }
      jobData.company = company._id;
    }
    delete jobData.companyName; // Remove the string field before saving

    // If still no company, try user's companyId
    if (!jobData.company && req.user.companyId) {
      jobData.company = req.user.companyId;
    }

    const job = await Job.create(jobData);

    const populatedJob = await Job.findById(job._id)
      .populate("company", "name logo")
      .populate("postedBy", "firstName lastName");

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: populatedJob,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
        field: Object.keys(error.errors)[0],
        errors: messages,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("company", "name logo")
      .populate("postedBy", "firstName lastName");

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "active", "closed", "paused"].includes(status)) {
      return res.status(400).json({ message: "Invalid job status" });
    }

    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, postedBy: req.user._id };

    const job = await Job.findOneAndUpdate(
      query,
      { status },
      { new: true, runValidators: true },
    )
      .populate("company", "name logo")
      .populate("postedBy", "firstName lastName");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const recruiterJobs = await Job.find({ postedBy: recruiterId }).select(
      "_id status",
    );
    const jobIds = recruiterJobs.map((j) => j._id);

    const activeJobs = recruiterJobs.filter(
      (j) => j.status === "active",
    ).length;
    const draftJobs = recruiterJobs.filter((j) => j.status === "draft").length;
    const closedJobs = recruiterJobs.filter(
      (j) => j.status === "closed",
    ).length;

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: { $ne: "withdrawn" },
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: { $in: ["shortlisted", "interviewing"] },
    });

    const interviewing = await Application.countDocuments({
      job: { $in: jobIds },
      status: "interviewing",
    });

    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected",
    });

    const hired = await Application.countDocuments({
      job: { $in: jobIds },
      status: "hired",
    });

    const totalViews = recruiterJobs.reduce(
      (sum, j) => sum + (j.viewCount || 0),
      0,
    );

    // Get total views directly from jobs
    const viewResult = await Job.aggregate([
      { $match: { postedBy: recruiterId } },
      { $group: { _id: null, total: { $sum: "$viewCount" } } },
    ]);
    const totalViewCount = viewResult.length > 0 ? viewResult[0].total : 0;

    // Recent applications
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "firstName lastName avatar")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent jobs
    const recentJobs = await Job.find({ postedBy: recruiterId })
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status type location createdAt applicationCount");

    res.json({
      success: true,
      stats: {
        activeJobs,
        draftJobs,
        closedJobs,
        totalApplications,
        shortlisted,
        interviewing,
        rejected,
        hired,
        totalViews: totalViewCount,
      },
      recentApplications,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
