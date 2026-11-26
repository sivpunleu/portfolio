const Joi = require("joi");

// At least 8 chars, lowercase, uppercase, number, and any non-alphanumeric symbol (no whitespace)
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters long without spaces and include uppercase, lowercase, number, and special character";

const httpUrlSchema = Joi.string()
  .trim()
  .max(255)
  .uri({ scheme: ["http", "https"] });

// Allows either external http(s) URLs or local uploaded file paths (/uploads/...)
const mediaUrlSchema = Joi.alternatives().try(
  httpUrlSchema,
  Joi.string()
    .trim()
    .max(255)
    .pattern(/^\/uploads\/[a-zA-Z0-9._-]+$/),
);

module.exports = {
  PASSWORD_REGEX,
  PASSWORD_RULE_MESSAGE,
  httpUrlSchema,
  mediaUrlSchema,
};

