import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalJobs = await Job.countDocuments({ status: "active" });
    const totalCompanies = await Company.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email role createdAt");

    const recentJobs = await Job.find()
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalCandidates,
        totalJobs,
        totalCompanies,
        totalApplications,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filters (10 per page default)
// @access  Private/Admin
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
        { skills: { $regex: searchRegex } },
        { "education.school": { $regex: searchRegex } },
        { "education.degree": { $regex: searchRegex } },
        { "education.field": { $regex: searchRegex } },
      ];
    }

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);
    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Get users with application counts
    const users = await User.find(query)
      .select("-password -refreshToken")
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .sort(sortOption)
      .lean();

    // Get application counts for each user
    const userIds = users.map((u) => u._id);
    const applicationCounts = await Application.aggregate([
      { $match: { candidate: { $in: userIds } } },
      { $group: { _id: "$candidate", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    applicationCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const usersWithCounts = users.map((u) => ({
      ...u,
      jobsAppliedCount: countMap[u._id.toString()] || 0,
    }));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users: usersWithCounts,
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
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private/Admin
router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isActive = isActive;
      await user.save();

      res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify user
// @access  Private/Admin
router.put(
  "/users/:id/verify",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isVerified = !user.isVerified;
      await user.save();

      res.json({
        success: true,
        message: `User ${user.isVerified ? "verified" : "unverified"} successfully`,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/admin/jobs
// @desc    Get all jobs for admin (10 per page default)
// @access  Private/Admin
router.get("/jobs", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      type,
      experienceLevel,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);
    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo")
        .populate("postedBy", "firstName lastName")
        .limit(parsedLimit)
        .skip((parsedPage - 1) * parsedLimit)
        .sort(sortOption),
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
});

// @route   GET /api/admin/applications
// @desc    Get all applications with pagination and search
// @access  Private/Admin
router.get("/applications", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (status) query.status = status;

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);
    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // If search query is provided, find matching candidates first
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const matchingCandidates = await User.find({
        $or: [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      }).select("_id");
      query.candidate = { $in: matchingCandidates.map((c) => c._id) };
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("job", "title company")
        .populate("candidate", "firstName lastName email phone")
        .populate("company", "name")
        .limit(parsedLimit)
        .skip((parsedPage - 1) * parsedLimit)
        .sort(sortOption),
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
});

// @route   GET /api/admin/candidate/:id
// @desc    Get candidate complete profile
// @access  Private/Admin
router.get("/candidate/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken -passwordHistory")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    // Get resume info
    const resumes = await Resume.find({ candidate: user._id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    // Get application count
    const applicationCount = await Application.countDocuments({
      candidate: user._id,
    });

    res.json({
      success: true,
      profile: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        resumes,
        applicationCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @route   GET /api/admin/candidate/:id/applications
// @desc    Get candidate's application history
// @access  Private/Admin
router.get(
  "/candidate/:id/applications",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedPage = Math.max(Number(page), 1);
      const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);

      const [applications, total] = await Promise.all([
        Application.find({ candidate: req.params.id })
          .populate({
            path: "job",
            select: "title company location type salary status",
            populate: { path: "company", select: "name logo" },
          })
          .populate("company", "name logo")
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        Application.countDocuments({ candidate: req.params.id }),
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
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  },
);

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete any job
// @access  Private/Admin
router.delete("/jobs/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
