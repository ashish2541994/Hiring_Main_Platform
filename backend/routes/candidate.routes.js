import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Application from "../models/Application.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   GET /api/candidate/profile
// @desc    Get candidate profile
// @access  Private/Candidate
router.get("/profile", protect, authorize("candidate"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        location: user.location || {},
        skills: user.skills || [],
        education: user.education || [],
        languages: user.languages || [],
        socialLinks: user.socialLinks || {},
        resume: user.resume || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        nationality: user.nationality || "",
        preferredLanguage: user.preferredLanguage || "",
        currentCompany: user.currentCompany || "",
        currentDesignation: user.currentDesignation || "",
        yearsOfExperience: user.yearsOfExperience || 0,
        expectedSalary: user.expectedSalary || "",
        preferredJobType: user.preferredJobType || "",
        preferredLocation: user.preferredLocation || "",
        professionalSummary: user.professionalSummary || "",
        availability: user.availability || "",
        profileCompletion: user.getProfileCompletion
          ? user.getProfileCompletion()
          : 0,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @route   PUT /api/candidate/profile
// @desc    Update candidate profile
// @access  Private/Candidate
router.put("/profile", protect, authorize("candidate"), async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "bio",
      "gender",
      "dateOfBirth",
      "nationality",
      "preferredLanguage",
      "currentCompany",
      "currentDesignation",
      "yearsOfExperience",
      "expectedSalary",
      "preferredJobType",
      "preferredLocation",
      "professionalSummary",
      "availability",
      "skills",
      "education",
      "languages",
      "socialLinks",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (req.body.location) {
      updateData.location = req.body.location;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        location: user.location || {},
        skills: user.skills || [],
        education: user.education || [],
        languages: user.languages || [],
        socialLinks: user.socialLinks || {},
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        nationality: user.nationality || "",
        preferredLanguage: user.preferredLanguage || "",
        currentCompany: user.currentCompany || "",
        currentDesignation: user.currentDesignation || "",
        yearsOfExperience: user.yearsOfExperience || 0,
        expectedSalary: user.expectedSalary || "",
        preferredJobType: user.preferredJobType || "",
        preferredLocation: user.preferredLocation || "",
        professionalSummary: user.professionalSummary || "",
        availability: user.availability || "",
        profileCompletion: user.getProfileCompletion
          ? user.getProfileCompletion()
          : 0,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @route   GET /api/candidate/:candidateId/profile
// @desc    Get candidate profile (for recruiter view)
// @access  Private (Recruiter, Admin)
router.get(
  "/:candidateId/profile",
  protect,
  authorize("recruiter", "admin", "candidate"),
  async (req, res) => {
    try {
      const { candidateId } = req.params;
      const user = await User.findById(candidateId).select(
        "-password -refreshToken",
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Candidate not found" });
      }

      // Get application history for this candidate
      const applicationHistory = await Application.find({
        candidate: candidateId,
      })
        .populate({
          path: "job",
          select: "title company status",
          populate: { path: "company", select: "name logo" },
        })
        .sort({ createdAt: -1 })
        .limit(20);

      res.json({
        success: true,
        profile: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          location: user.location || {},
          skills: user.skills || [],
          education: user.education || [],
          languages: user.languages || [],
          socialLinks: user.socialLinks || {},
          resume: user.resume || "",
          gender: user.gender || "",
          dateOfBirth: user.dateOfBirth || "",
          nationality: user.nationality || "",
          currentCompany: user.currentCompany || "",
          currentDesignation: user.currentDesignation || "",
          yearsOfExperience: user.yearsOfExperience || 0,
          professionalSummary: user.professionalSummary || "",
          profileCompletion: user.getProfileCompletion
            ? user.getProfileCompletion()
            : 0,
          applicationHistory: applicationHistory.map((app) => ({
            _id: app._id,
            jobId: app.job?._id,
            jobTitle: app.job?.title || "Unknown",
            company: app.job?.company
              ? {
                  _id: app.job.company._id,
                  name: app.job.company.name,
                }
              : null,
            status: app.status,
            appliedAt: app.createdAt,
            candidateSnapshot: app.candidateSnapshot || null,
          })),
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

// @route   GET /api/candidate/:candidateId/resume
// @desc    View/download candidate resume
// @access  Private (Recruiter, Admin)
router.get(
  "/:candidateId/resume",
  protect,
  authorize("recruiter", "admin", "candidate"),
  async (req, res) => {
    try {
      const { candidateId } = req.params;

      // First try to find active resume in Resume collection
      let resume = await Resume.findOne({
        candidate: candidateId,
        isActive: true,
      });

      if (!resume) {
        // Fallback: check user's resume field
        const user = await User.findById(candidateId);
        if (!user || !user.resume) {
          return res.status(404).json({
            success: false,
            message: "Resume not found for this candidate",
          });
        }

        const resumePath = path.join(__dirname, "..", user.resume);
        if (fs.existsSync(resumePath)) {
          const ext = path.extname(resumePath).toLowerCase();
          const mimeTypes = {
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          };
          return res.sendFile(resumePath, {
            headers: {
              "Content-Type": mimeTypes[ext] || "application/octet-stream",
              "Content-Disposition": `inline; filename="resume${ext}"`,
            },
          });
        }

        return res.status(404).json({
          success: false,
          message: "Resume file not found on disk",
        });
      }

      const resumePath = path.join(__dirname, "..", resume.file);
      if (!fs.existsSync(resumePath)) {
        return res.status(404).json({
          success: false,
          message: "Resume file not found on disk",
        });
      }

      res.sendFile(resumePath, {
        headers: {
          "Content-Type": resume.mimeType || "application/pdf",
          "Content-Disposition": `inline; filename="${resume.originalName || "resume.pdf"}"`,
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

export default router;
