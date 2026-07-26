import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate is required"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Snapshot of candidate details at the time of application
    candidateSnapshot: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      location: {
        addressLine1: { type: String, default: "" },
        addressLine2: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
        zipCode: { type: String, default: "" },
      },
      education: [
        {
          school: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
        },
      ],
      skills: [{ type: String, trim: true }],
      resume: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "interviewing",
        "offered",
        "hired",
        "rejected",
        "withdrawn",
      ],
      default: "pending",
    },
    coverLetter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    resume: {
      type: String,
      default: "",
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    resumeSource: {
      type: String,
      enum: ["existing", "new_upload", "account"],
      default: "account",
    },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    notes: [
      {
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    timeline: [
      {
        status: String,
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    withdrawnAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectedReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Add initial timeline entry on creation
applicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.timeline.push({
      status: this.status,
      note: "Application submitted",
    });
  }
  next();
});

export default mongoose.model("Application", applicationSchema);
