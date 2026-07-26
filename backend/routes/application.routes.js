import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  applicationValidation,
  handleValidationErrors,
} from "../middleware/validator.js";
import {
  getApplications,
  getMyApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplicants,
} from "../controllers/applicationController.js";

const router = express.Router();

// @route   GET /api/applications
// @desc    Get all applications (filtered by role)
// @access  Private
router.get("/", protect, getApplications);

// @route   GET /api/applications/my
// @desc    Get the authenticated candidate's applications
// @access  Private/Candidate
router.get("/my", protect, authorize("candidate"), getMyApplications);

// @route   GET /api/applications/job/:jobId/applicants
// @desc    Get all applicants for a specific job
// @access  Private/Recruiter
router.get(
  "/job/:jobId/applicants",
  protect,
  authorize("recruiter", "admin"),
  getJobApplicants,
);

// @route   POST /api/applications
// @desc    Create an application
// @access  Private/Candidate
router.post(
  "/",
  protect,
  authorize("candidate"),
  applicationValidation,
  handleValidationErrors,
  createApplication,
);

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get("/:id", protect, getApplicationById);

// @route   PATCH /api/applications/:id
// @desc    Update application status
// @access  Private/Recruiter
router.patch(
  "/:id",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus,
);

// @route   PUT /api/applications/:id
// @desc    Update application status (alternative method)
// @access  Private/Recruiter
router.put(
  "/:id",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus,
);

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private/Candidate
router.delete("/:id", protect, authorize("candidate"), withdrawApplication);

export default router;
