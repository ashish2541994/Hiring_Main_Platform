import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSavedJob,
  getSavedJobIds,
} from "../controllers/savedJobController.js";

const router = express.Router();

// @route   GET /api/saved-jobs
// @desc    Get all saved jobs for candidate
// @access  Private/Candidate
router.get("/", protect, authorize("candidate"), getSavedJobs);

// @route   GET /api/saved-jobs/ids
// @desc    Get all saved job IDs
// @access  Private/Candidate
router.get("/ids", protect, authorize("candidate"), getSavedJobIds);

// @route   GET /api/saved-jobs/check/:jobId
// @desc    Check if a job is saved
// @access  Private/Candidate
router.get("/check/:jobId", protect, authorize("candidate"), checkSavedJob);

// @route   POST /api/saved-jobs/:jobId
// @desc    Save a job
// @access  Private/Candidate
router.post("/:jobId", protect, authorize("candidate"), saveJob);

// @route   DELETE /api/saved-jobs/:jobId
// @desc    Remove saved job
// @access  Private/Candidate
router.delete("/:jobId", protect, authorize("candidate"), unsaveJob);

export default router;
