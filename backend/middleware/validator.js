import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

export const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("role")
    .optional()
    .isIn(["admin", "recruiter", "candidate"])
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const jobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("requirements")
    .trim()
    .notEmpty()
    .withMessage("Requirements are required")
    .isLength({ max: 3000 })
    .withMessage("Requirements cannot exceed 3000 characters"),
  body("responsibilities")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Responsibilities cannot exceed 3000 characters"),
  body("benefits")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Benefits cannot exceed 2000 characters"),
  body("type")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship", "freelance"])
    .withMessage("Invalid job type"),
  body("experienceLevel")
    .optional()
    .isIn(["entry", "junior", "mid", "senior", "lead", "executive"])
    .withMessage("Invalid experience level"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

export const companyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("industry")
    .notEmpty()
    .withMessage("Industry is required")
    .isIn([
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
    ])
    .withMessage("Invalid industry"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
];

export const applicationValidation = [
  body("job").notEmpty().withMessage("Job is required"),
  body("coverLetter")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Cover letter cannot exceed 2000 characters"),
];
