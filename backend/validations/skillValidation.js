const Joi = require("joi");

const validCategories = [
  "Frontend",
  "Backend",
  "Database",
  "Tools",
  "DevOps",
  "Other",
];

const skillSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Skill name is required",
    "any.required": "Skill name is required",
  }),
  category: Joi.string()
    .valid(...validCategories)
    .default("Other")
    .messages({
      "any.only": `Category must be one of: ${validCategories.join(", ")}`,
    }),
  proficiency_percent: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .empty("")
    .allow(null)
    .optional()
    .messages({
      "number.min": "Proficiency must be at least 0%",
      "number.max": "Proficiency cannot exceed 100%",
    }),
  icon_url: Joi.string().trim().max(255).allow(null, "").optional(),
  display_order: Joi.number().integer().min(0).empty("").default(0).optional(),
});

const updateSkillSchema = skillSchema;

module.exports = {
  skillSchema,
  updateSkillSchema,
};
