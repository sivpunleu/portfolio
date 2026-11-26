const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { validateIdParam } = validation;
const {
  skillSchema,
  updateSkillSchema,
} = require("../validations/skillValidation");
const {
  getSkills,
  getSkillById,
  addSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skills");

// Public routes
router.get("/api/skills", getSkills);
router.get("/api/skills/:id", validateIdParam(), getSkillById);

// Protected Admin routes
router.post(
  "/api/skills",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validation(skillSchema),
  addSkill,
);

router.put(
  "/api/skills/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  validation(updateSkillSchema),
  updateSkill,
);

router.delete(
  "/api/skills/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  deleteSkill,
);

module.exports = router;
