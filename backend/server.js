import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import config from "./config/appConfig.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import savedJobRoutes from "./routes/savedJob.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

dotenv.config();

const app = express();

// Middleware
if (config.security.enableHelmet) {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
}

if (config.security.enableCors) {
  app.use(
    cors({
      origin: config.server.frontendUrl,
      credentials: true,
    }),
  );
}

if (config.security.enableCompression) {
  app.use(compression());
}

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Intelligent per-endpoint rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes.",
  },
});

const moderateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP requests, please try again after 10 minutes.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many password reset requests, please try again after an hour.",
  },
});

const applyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many applications, please slow down.",
  },
});

if (config.security.enableRateLimit) {
  // Apply general limiter to all routes
  app.use("/api", generalLimiter);

  // Stricter limits on auth routes
  app.use("/api/auth/login", strictLimiter);
  app.use("/api/auth/register", moderateLimiter);
  app.use("/api/auth/forgot-password", forgotPasswordLimiter);
  app.use("/api/auth/reset-password", forgotPasswordLimiter);
  app.use("/api/auth/verify-email", otpLimiter);
  app.use("/api/auth/resend-otp", otpLimiter);

  // Application rate limit
  app.use("/api/applications", applyLimiter);
}

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/candidate", candidateRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Wind Hire API is running" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection - use config MongoDB URI
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/windhire",
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Start server - use config port
const PORT = config.server.port;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();

export default app;
