import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "company",
        "recruiter",
        "hr",
        "interviewer",
        "candidate",
        "guest",
      ],
      default: "candidate",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    phone: {
      type: String,
      trim: true,
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
    coverPhoto: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
      },
    ],
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
        },
      },
    ],
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    resume: {
      type: String,
      default: "",
    },
    // Extended candidate profile fields
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
      default: "",
    },
    preferredLanguage: {
      type: String,
      default: "",
    },
    currentCompany: {
      type: String,
      default: "",
    },
    currentDesignation: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    expectedSalary: {
      type: String,
      default: "",
    },
    preferredJobType: {
      type: String,
      default: "",
    },
    preferredLocation: {
      type: String,
      default: "",
    },
    professionalSummary: {
      type: String,
      maxlength: [2000, "Professional summary cannot exceed 2000 characters"],
      default: "",
    },
    availability: {
      type: String,
      enum: ["immediately", "15_days", "30_days", "60_days", "negotiable", ""],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    lastPasswordChange: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    passwordHistory: [
      {
        password: String,
        changedAt: Date,
      },
    ],
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Add to password history (keep last 5 passwords)
  if (this.passwordHistory && this.passwordHistory.length >= 5) {
    this.passwordHistory.shift();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.lastPasswordChange = new Date();

  if (!this.passwordHistory) {
    this.passwordHistory = [];
  }
  this.passwordHistory.push({
    password: this.password,
    changedAt: new Date(),
  });

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment failed login attempts
userSchema.methods.incrementFailedLogin = function () {
  this.failedLoginAttempts += 1;

  // Lock account after 5 failed attempts for 15 minutes
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000;
  }

  return this.save();
};

// Reset failed login attempts
userSchema.methods.resetFailedLogin = function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Check if password is in history
userSchema.methods.isPasswordInHistory = async function (candidatePassword) {
  if (!this.passwordHistory || this.passwordHistory.length === 0) {
    return false;
  }

  for (const entry of this.passwordHistory) {
    const isMatch = await bcrypt.compare(candidatePassword, entry.password);
    if (isMatch) {
      return true;
    }
  }
  return false;
};

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function () {
  const fields = [
    this.firstName,
    this.lastName,
    this.email,
    this.phone,
    this.location?.addressLine1,
    this.location?.city,
    this.location?.state,
    this.location?.country,
    this.location?.zipCode,
    this.bio,
    this.skills && this.skills.length > 0,
    this.education && this.education.length > 0,
    this.resume,
  ];

  const completedFields = fields.filter(
    (field) => field && field !== "",
  ).length;
  return Math.round((completedFields / fields.length) * 100);
};

// Get missing profile fields
userSchema.methods.getMissingProfileFields = function () {
  const missing = [];

  if (!this.phone) missing.push("phone");
  if (!this.location?.addressLine1) missing.push("addressLine1");
  if (!this.location?.city) missing.push("city");
  if (!this.location?.state) missing.push("state");
  if (!this.location?.country) missing.push("country");
  if (!this.location?.zipCode) missing.push("zipCode");
  if (!this.bio) missing.push("bio");
  if (!this.skills || this.skills.length === 0) missing.push("skills");
  if (!this.education || this.education.length === 0) missing.push("education");
  if (!this.resume) missing.push("resume");

  return missing;
};

// Get full name virtual
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Index for faster queries (unique fields already have indexes)
userSchema.index({ role: 1 });
userSchema.index({ companyId: 1 });
userSchema.index({ emailVerified: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.model("User", userSchema);
