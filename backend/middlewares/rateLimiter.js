const rateLimit = require("express-rate-limit");

// General API rate limiter (200 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Sensitive Auth routes limiter (10 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login/auth attempts from this IP, please try again after 15 minutes.",
  },
});

// Contact message submission limiter (5 requests per 15 mins)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many messages sent from this IP. Please wait a few minutes before trying again.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  contactLimiter,
};
