import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      enum: [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Manufacturing",
        "Retail",
        "Media",
        "Consulting",
        "Government",
        "Non-profit",
        "Energy",
        "Transportation",
        "Real Estate",
        "Hospitality",
        "Other",
      ],
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      default: "1-10",
    },
    founded: {
      type: Number,
      min: [1800, "Invalid founding year"],
      max: [new Date().getFullYear(), "Invalid founding year"],
    },
    location: {
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      landmark: { type: String, default: "" },
      coordinates: { type: String, default: "" },
    },
    website: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    mission: {
      type: String,
      maxlength: [1000, "Mission cannot exceed 1000 characters"],
    },
    values: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    culture: {
      type: String,
      maxlength: [1000, "Culture description cannot exceed 1000 characters"],
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug from name
companySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model("Company", companySchema);
