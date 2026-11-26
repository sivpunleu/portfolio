const Joi = require("joi");
const { httpUrlSchema, mediaUrlSchema } = require("./common");

const updateProfileSchema = Joi.object({
  full_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Full name cannot be empty",
    "any.required": "Full name is required",
  }),
  title: Joi.string().trim().max(100).required().messages({
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),
  bio: Joi.string().trim().required().messages({
    "string.empty": "Bio cannot be empty",
    "any.required": "Bio is required",
  }),
  email: Joi.string().trim().email().max(100).required().messages({
    "string.email": "Invalid email address format",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  phone: Joi.string().trim().max(20).allow(null, "").optional(),
  location: Joi.string().trim().max(100).allow(null, "").optional(),
  avatar_url: mediaUrlSchema.allow(null, "").optional().messages({
    "alternatives.match": "Avatar URL must be a valid HTTP(S) URL or uploaded image path",
  }),
  resume_url: mediaUrlSchema.allow(null, "").optional().messages({
    "alternatives.match": "Resume URL must be a valid HTTP(S) URL or uploaded PDF path",
  }),
  github_url: httpUrlSchema.allow(null, "").optional().messages({
    "string.uri": "GitHub URL must be a valid HTTP(S) URL",
  }),
  linkedin_url: httpUrlSchema.allow(null, "").optional().messages({
    "string.uri": "LinkedIn URL must be a valid HTTP(S) URL",
  }),
  twitter_url: httpUrlSchema.allow(null, "").optional().messages({
    "string.uri": "Twitter URL must be a valid HTTP(S) URL",
  }),
});

module.exports = {
  updateProfileSchema,
};
