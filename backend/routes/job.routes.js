import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  jobValidation,
  handleValidationErrors,
} from "../middleware/validator.js";
import {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getDashboardStats,
} from "../controllers/jobController.js";

const router = express.Router();

// @route   GET /api/jobs/dashboard-stats
// @desc    Get recruiter dashboard statistics
// @access  Private/Recruiter
router.get(
  "/dashboard-stats",
  protect,
  authorize("recruiter", "admin"),
  getDashboardStats,
);

// @route   GET /api/jobs
// @desc    Get all published jobs
// @access  Public
router.get("/", getJobs);

// @route   GET /api/jobs/my-jobs
// @desc    Get jobs owned by the authenticated recruiter
// @access  Private/Recruiter
router.get("/my-jobs", protect, authorize("recruiter", "admin"), getMyJobs);

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private/Recruiter
router.post(
  "/",
  protect,
  authorize("recruiter", "admin"),
  jobValidation,
  handleValidationErrors,
  createJob,
);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get("/:id", getJobById);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private/Owner
router.put("/:id", protect, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private/Owner
router.delete("/:id", protect, deleteJob);

// @route   PATCH /api/jobs/:id/status
// @desc    Update job status (publish/close/draft)
// @access  Private/Recruiter
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter", "admin"),
  updateJobStatus,
);

export default router;
