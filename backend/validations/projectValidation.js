const Joi = require("joi");
const { httpUrlSchema, mediaUrlSchema } = require("./common");

const projectSchema = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.empty": "Project title is required",
    "any.required": "Project title is required",
  }),
  slug: Joi.string()
    .trim()
    .lowercase()
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base":
        "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  description: Joi.string().trim().required().messages({
    "string.empty": "Project description is required",
    "any.required": "Project description is required",
  }),
  thumbnail_url: mediaUrlSchema
    .allow(null, "")
    .optional()
    .messages({
      "alternatives.match": "Thumbnail URL must be a valid HTTP(S) URL or uploaded image path",
    }),
  tech_stack: Joi.array()
    .items(Joi.string().trim())
    .allow(null)
    .optional(),
  live_url: httpUrlSchema.allow(null, "").optional().messages({
    "string.uri": "Live demo URL must be a valid HTTP(S) URL",
  }),
  github_url: httpUrlSchema.allow(null, "").optional().messages({
    "string.uri": "GitHub URL must be a valid HTTP(S) URL",
  }),
  is_featured: Joi.boolean().default(false).optional(),
  display_order: Joi.number().integer().min(0).empty("").default(0).optional(),
});

const updateProjectSchema = projectSchema;

module.exports = {
  projectSchema,
  updateProjectSchema,
};
