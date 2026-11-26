const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { validateIdParam } = validation;
const {
  createEducationSchema,
  updateEducationSchema,
} = require("../validations/educationValidation");
const {
  getEducation,
  getEducationById,
  addEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/education");

router.get("/api/education", getEducation);
router.get("/api/education/:id", validateIdParam(), getEducationById);

// Protected Routes
router.post(
  "/api/education",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validation(createEducationSchema),
  addEducation,
);
router.put(
  "/api/education/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  validation(updateEducationSchema),
  updateEducation,
);
router.delete(
  "/api/education/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  deleteEducation,
);

module.exports = router;
