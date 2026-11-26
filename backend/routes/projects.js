const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { validateIdParam } = validation;
const {
  projectSchema,
  updateProjectSchema,
} = require("../validations/projectValidation");
const {
  getProjects,
  getProjectById,
  getProjectBySlug,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");

// Public routes
router.get("/api/projects", getProjects);
router.get("/api/projects/slug/:slug", getProjectBySlug);
router.get("/api/projects/:id", validateIdParam(), getProjectById);

// Protected Admin routes
router.post(
  "/api/projects",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validation(projectSchema),
  addProject,
);

router.put(
  "/api/projects/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  validation(updateProjectSchema),
  updateProject,
);

router.delete(
  "/api/projects/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  deleteProject,
);

module.exports = router;
