const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { validateIdParam } = validation;
const { contactLimiter } = require("../middlewares/rateLimiter");
const {
  contactMessageSchema,
} = require("../validations/contactValidation");
const {
  submitMessage,
  getMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
} = require("../controllers/contact");

// Public contact form submission with anti-spam rate limiter
router.post(
  "/api/contact",
  contactLimiter,
  validation(contactMessageSchema),
  submitMessage,
);

// Protected routes for Admin
router.get(
  "/api/contact",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  getMessages,
);
router.get(
  "/api/contact/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  getMessageById,
);
router.patch(
  "/api/contact/:id/read",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  markAsRead,
);
router.delete(
  "/api/contact/:id",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  validateIdParam(),
  deleteMessage,
);

module.exports = router;
