const Joi = require("joi");

const createEducationSchema = Joi.object({
  school_name: Joi.string().trim().max(150).required().messages({
    "string.empty": "School name cannot be empty",
    "any.required": "School name is required",
  }),
  degree: Joi.string().trim().max(150).required().messages({
    "string.empty": "Degree cannot be empty",
    "any.required": "Degree is required",
  }),
  field_of_study: Joi.string().trim().max(100).allow(null, "").optional(),
  start_date: Joi.date().iso().required().messages({
    "date.base": "Invalid start date format (must be YYYY-MM-DD or ISO date)",
    "date.format": "Start date must be in ISO format (e.g. YYYY-MM-DD)",
    "any.required": "Start date is required",
  }),
  end_date: Joi.date()
    .iso()
    .min(Joi.ref("start_date"))
    .allow(null, "")
    .optional()
    .messages({
      "date.base": "Invalid end date format (must be YYYY-MM-DD or ISO date)",
      "date.min": "Start date cannot be after end date",
    }),
  grade: Joi.string().trim().max(20).allow(null, "").optional(),
  description: Joi.string().trim().allow(null, "").optional(),
  display_order: Joi.number().integer().min(0).empty("").default(0).optional(),
});

const updateEducationSchema = createEducationSchema;

module.exports = {
  createEducationSchema,
  updateEducationSchema,
};