const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
  resendEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateMe,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const { authLimiter } = require("../middlewares/rateLimiter");
const schema = require("../validations/authValidation");

router.post(
  "/api/auth/register",
  authLimiter,
  validation(schema.registerUserSchema),
  register,
);
router.post(
  "/api/auth/login",
  authLimiter,
  validation(schema.loginUserSchema),
  login,
);
router.post("/api/auth/logout", authMiddleware.isloginOrExpired, logout);

router.get(
  "/api/auth/verify-email",
  validation(schema.verifyEmailQuerySchema, "query"),
  verifyEmail,
);
router.post(
  "/api/auth/resend-email",
  authLimiter,
  validation(schema.emailSchema),
  resendEmail,
);

router.post(
  "/api/auth/forgot-password",
  authLimiter,
  validation(schema.emailSchema),
  forgotPassword,
);
router.put(
  "/api/auth/reset-password",
  validation(schema.resetPasswordSchema),
  resetPassword,
);
router.put(
  "/api/auth/change-password",
  authMiddleware.islogin,
  validation(schema.changePasswordSchema),
  changePassword,
);

router.get("/api/auth/me", authMiddleware.islogin, getMe);
router.put(
  "/api/auth/me",
  authMiddleware.islogin,
  validation(schema.updateMeSchema),
  updateMe,
);

module.exports = router;
