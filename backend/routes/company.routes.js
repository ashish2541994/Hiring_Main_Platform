import express from "express";
import Company from "../models/Company.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  companyValidation,
  handleValidationErrors,
} from "../middleware/validator.js";

const router = express.Router();

// @route   GET /api/companies/my
// @desc    Get the current user's company
// @access  Private/Recruiter
router.get(
  "/my",
  protect,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      // First check if user has companyId directly
      if (req.user.companyId) {
        const company = await Company.findById(req.user.companyId).populate(
          "owners",
          "firstName lastName email avatar",
        );
        if (company) {
          return res.json({ success: true, company });
        }
      }

      // Fallback: find company where user is an owner
      const company = await Company.findOne({ owners: req.user.id }).populate(
        "owners",
        "firstName lastName email avatar",
      );

      if (!company) {
        return res
          .status(404)
          .json({ success: false, message: "No company profile found" });
      }

      res.json({ success: true, company });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, industry } = req.query;

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (industry) {
      query.industry = industry;
    }

    const companies = await Company.find(query)
      .populate("owners", "firstName lastName email avatar")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "owners",
      "firstName lastName email avatar",
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/companies
// @desc    Create a company
// @access  Private/Recruiter
router.post(
  "/",
  protect,
  authorize("recruiter", "admin"),
  companyValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Check if user already has a company
      const existingCompany = await Company.findOne({ owners: req.user.id });
      if (existingCompany) {
        return res
          .status(400)
          .json({
            success: false,
            message: "You already have a company profile",
          });
      }

      const company = await Company.create({
        ...req.body,
        owners: [req.user.id],
      });

      // Update user's companyId
      await req.user.constructor.findByIdAndUpdate(req.user.id, {
        companyId: company._id,
      });

      res.status(201).json({
        success: true,
        message: "Company created successfully",
        company,
      });
    } catch (error) {
      // Handle mongoose validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({
          success: false,
          message: messages[0],
          field: Object.keys(error.errors)[0],
          errors: messages,
        });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private/Owner
router.put("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user is owner or admin
    if (
      !company.owners.some((o) => o.toString() === req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this company" });
    }

    // Update fields
    Object.assign(company, req.body);

    try {
      await company.save();
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({
          success: false,
          message: messages[0],
          field: Object.keys(error.errors)[0],
          errors: messages,
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete company
// @access  Private/Owner
router.delete("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (
      !company.owners.some((o) => o.toString() === req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this company" });
    }

    await company.deleteOne();

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
