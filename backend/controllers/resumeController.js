import Resume from "../models/Resume.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/resumes directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF and Word documents are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// @desc    Upload resume
// @route   POST /api/resumes/upload
// @access  Private/Candidate
export const uploadResume = [
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file",
        });
      }

      const relativePath = `uploads/resumes/${req.file.filename}`;

      // Deactivate all old active resumes for this candidate
      const oldResumes = await Resume.find({
        candidate: req.user._id,
        isActive: true,
      });

      // Delete old resume files from disk and deactivate them
      for (const oldResume of oldResumes) {
        const oldFilePath = path.join(__dirname, "..", oldResume.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        oldResume.isActive = false;
        await oldResume.save();
      }

      // Create new resume record
      const resume = await Resume.create({
        candidate: req.user._id,
        file: relativePath,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        isActive: true,
      });

      // ALWAYS update the user's resume field to point to the new file
      req.user.resume = relativePath;
      await req.user.save();

      res.status(201).json({
        success: true,
        message: "Resume uploaded successfully",
        resume: {
          _id: resume._id,
          file: resume.file,
          originalName: resume.originalName,
          fileSize: resume.fileSize,
          mimeType: resume.mimeType,
          createdAt: resume.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
];

// @desc    Get all candidate's resumes
// @route   GET /api/resumes
// @access  Private/Candidate
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      candidate: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes: resumes.map((r) => ({
        _id: r._id,
        file: r.file,
        originalName: r.originalName,
        fileSize: r.fileSize,
        mimeType: r.mimeType,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private/Candidate
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, "..", resume.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resume.deleteOne();

    // If this was the active resume, clear user's resume field
    if (req.user.resume === resume.file) {
      req.user.resume = "";
      await req.user.save();
    }

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Select a resume as active for application
// @route   PUT /api/resumes/:id/select
// @access  Private/Candidate
export const selectResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    req.user.resume = resume.file;
    await req.user.save();

    res.json({
      success: true,
      message: "Resume selected successfully",
      resume: {
        file: resume.file,
        originalName: resume.originalName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
