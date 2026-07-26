import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Posted by is required"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      maxlength: [3000, "Requirements cannot exceed 3000 characters"],
    },
    responsibilities: {
      type: String,
      maxlength: [3000, "Responsibilities cannot exceed 3000 characters"],
    },
    benefits: {
      type: String,
      maxlength: [2000, "Benefits cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead", "executive"],
      default: "mid",
    },
    location: {
      type: {
        type: String,
        enum: ["on-site", "hybrid", "remote"],
        default: "on-site",
      },
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      landmark: { type: String, default: "" },
      coordinates: { type: String, default: "" },
    },
    salary: {
      min: {
        type: Number,
        min: [0, "Minimum salary must be positive"],
      },
      max: {
        type: Number,
        min: [0, "Maximum salary must be positive"],
      },
      currency: {
        type: String,
        default: "USD",
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "paused"],
      default: "draft",
    },
    expiresAt: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug from title and company
jobSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.Job.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Set expiration date if not set
  if (!this.expiresAt && this.status === "active") {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    this.expiresAt = expiresAt;
  }

  next();
});

// Index for search
jobSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
