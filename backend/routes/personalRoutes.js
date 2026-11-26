const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { updateProfileSchema } = require("../validations/personalValidation");
const {
  getProfile,
  updateProfile,
} = require("../controllers/personalControllers");

// Public route to view portfolio profile
router.get("/api/profile", getProfile);

// Protected route for admin to update portfolio profile
router.put(
  "/api/profile",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validation(updateProfileSchema),
  updateProfile,
);

module.exports = router;