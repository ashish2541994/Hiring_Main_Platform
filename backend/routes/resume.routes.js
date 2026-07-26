import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  uploadResume,
  getResumes,
  deleteResume,
  selectResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// @route   POST /api/resumes/upload
// @desc    Upload resume file
// @access  Private/Candidate
router.post("/upload", protect, authorize("candidate"), uploadResume);

// @route   GET /api/resumes
// @desc    Get all resumes for candidate
// @access  Private/Candidate
router.get("/", protect, authorize("candidate"), getResumes);

// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @access  Private/Candidate
router.delete("/:id", protect, authorize("candidate"), deleteResume);

// @route   PUT /api/resumes/:id/select
// @desc    Select a resume as active
// @access  Private/Candidate
router.put("/:id/select", protect, authorize("candidate"), selectResume);

export default router;
