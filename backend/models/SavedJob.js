import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate is required"],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate saves
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

// Auto-populate job details when queried
savedJobSchema.pre(/^find/, function (next) {
  this.populate({
    path: "job",
    select:
      "title company location salary type status skills experienceLevel createdAt",
    populate: {
      path: "company",
      select: "name logo",
    },
  });
  next();
});

export default mongoose.model("SavedJob", savedJobSchema);
