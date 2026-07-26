import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;

    let query = {};

    // Candidates can only see their own applications
    if (req.user.role === "candidate") {
      query.candidate = req.user._id;
    }
    // Recruiters can see applications for their jobs
    else if (req.user.role === "recruiter") {
      const ownJobs = await Job.find({ postedBy: req.user._id }).select("_id");
      query.job = { $in: ownJobs.map((j) => j._id) };
    }
    // Admins can see all
    else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (status) query.status = status;
    if (jobId) query.job = jobId;

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("job", "title company postedBy")
        .populate("candidate", "firstName lastName email")
        .populate("company", "name logo")
        .populate("recruiter", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      applications,
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

export const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;
    const query = { candidate: req.user._id };
    if (status) query.status = status;
    if (jobId) query.job = jobId;

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate({
          path: "job",
          select: "title company location type salary status",
          populate: { path: "company", select: "name logo" },
        })
        .populate("company", "name logo")
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      applications,
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

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "title company description requirements")
      .populate("candidate", "firstName lastName email skills education")
      .populate("company", "name logo")
      .populate("recruiter", "firstName lastName")
      .populate("notes.addedBy", "firstName lastName");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization
    if (
      application.candidate._id.toString() !== req.user._id.toString() &&
      application.recruiter?._id?.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const {
      job: jobId,
      coverLetter,
      resumeId,
      resumeUrl,
      resumeSource,
    } = req.body;

    const job = await Job.findOne({ _id: jobId, status: "active" });
    if (!job) return res.status(404).json({ message: "Active job not found" });

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    // Determine resume path
    let resumePath = req.user.resume || "not-provided";
    let appResumeId = undefined;
    let appResumeSource = "account";

    if (resumeSource === "existing" && resumeId) {
      appResumeId = resumeId;
      appResumeSource = "existing";
    } else if (resumeSource === "new_upload" && resumeUrl) {
      resumePath = resumeUrl;
      appResumeSource = "new_upload";
      req.user.resume = resumeUrl;
      await req.user.save();
    } else if (resumeUrl) {
      resumePath = resumeUrl;
      req.user.resume = resumeUrl;
      await req.user.save();
    }

    // Build candidate snapshot from current user data
    const user = req.user;
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const addressParts = [
      user.location?.addressLine1,
      user.location?.addressLine2,
      user.location?.city,
      user.location?.state,
      user.location?.country,
    ].filter(Boolean);
    const addressStr = addressParts.join(", ");

    const candidateSnapshot = {
      name: fullName,
      email: user.email || "",
      phone: user.phone || "",
      address: addressStr,
      location: user.location || {},
      education: user.education || [],
      skills: user.skills || [],
      resume: resumePath,
    };

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      company: job.company,
      recruiter: job.postedBy,
      coverLetter,
      resume: resumePath,
      resumeId: appResumeId,
      resumeSource: appResumeSource,
      candidateSnapshot,
    });

    // Update job application count
    await Job.updateOne({ _id: job._id }, { $inc: { applicationCount: 1 } });

    const populatedApplication = await Application.findById(application._id)
      .populate("job", "title company")
      .populate("candidate", "firstName lastName email phone");

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rating, tags } = req.body;

    const application = await Application.findById(req.params.id).populate(
      "job",
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      req.user.role !== "admin" &&
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    const previousStatus = application.status;
    application.status = status || application.status;
    application.rating = rating !== undefined ? rating : application.rating;
    application.tags = tags || application.tags;
    application.recruiter = req.user._id;

    // Add timeline entry
    if (status && status !== previousStatus) {
      application.timeline.push({
        status,
        note: `Status changed to ${status}`,
      });
    }

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate("job", "title")
      .populate("candidate", "firstName lastName");

    res.json({
      success: true,
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to withdraw this application" });
    }

    application.status = "withdrawn";
    application.withdrawnAt = new Date();
    await application.save();

    res.json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCandidateDashboardStats = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const totalApplications = await Application.countDocuments({
      candidate: candidateId,
    });
    const interviews = await Application.countDocuments({
      candidate: candidateId,
      status: "interviewing",
    });
    const shortlisted = await Application.countDocuments({
      candidate: candidateId,
      status: "shortlisted",
    });

    // Saved jobs count (if saved jobs feature is implemented)
    const SavedJob = await import("../models/Job.js").then(() => null);
    let savedJobs = 0;
    // Try to get saved jobs count - this depends on implementation

    res.json({
      success: true,
      stats: {
        totalApplications,
        interviews,
        shortlisted,
        savedJobs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all applicants for a specific job (recruiter)
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check authorization: only recruiter who posted the job or admin can view
    if (
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants for this job" });
    }

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

    const query = { job: jobId };
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("candidate", "firstName lastName email phone avatar")
        .populate("company", "name logo")
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
      },
      applications,
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
