import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate is required"],
    },
    file: {
      type: String,
      required: [true, "Resume file is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

resumeSchema.index({ candidate: 1, isActive: 1 });

export default mongoose.model("Resume", resumeSchema);
