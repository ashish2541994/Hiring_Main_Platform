import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private/Candidate
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if already saved
    const existing = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      candidate: req.user._id,
      job: jobId,
    });

    const populated = await SavedJob.findById(savedJob._id);

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Remove a saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private/Candidate
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    res.json({
      success: true,
      message: "Job removed from saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all saved jobs for candidate
// @route   GET /api/saved-jobs
// @access  Private/Candidate
export const getSavedJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 50);

    const query = { candidate: req.user._id };

    const [savedJobs, total] = await Promise.all([
      SavedJob.find(query)
        .populate({
          path: "job",
          select:
            "title company location salary type status skills experienceLevel createdAt slug",
          populate: {
            path: "company",
            select: "name logo industry",
          },
        })
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      SavedJob.countDocuments(query),
    ]);

    // Filter out saved jobs where the job has been deleted
    const validSavedJobs = savedJobs.filter((sj) => sj.job !== null);

    res.json({
      success: true,
      jobs: validSavedJobs.map((sj) => sj.job),
      savedJobIds: savedJobs.map((sj) => sj.job?._id).filter(Boolean),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
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

// @desc    Check if job is saved
// @route   GET /api/saved-jobs/check/:jobId
// @access  Private/Candidate
export const checkSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const saved = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    res.json({
      success: true,
      isSaved: !!saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all saved job IDs for candidate
// @route   GET /api/saved-jobs/ids
// @access  Private/Candidate
export const getSavedJobIds = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      candidate: req.user._id,
    }).select("job");

    const jobIds = savedJobs.map((sj) => sj.job).filter(Boolean);

    res.json({
      success: true,
      savedJobIds: jobIds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
