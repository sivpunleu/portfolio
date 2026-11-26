const Joi = require("joi");
const { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } = require("./common");

const registerUserSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base": PASSWORD_RULE_MESSAGE,
    "any.required": "Password is required",
  }),
  phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .optional()
    .allow(null, "")
    .messages({
      "string.min": "Phone number must be at least 7 digits",
      "string.max": "Phone number cannot exceed 20 digits",
    }),
});


const loginUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

const verifyEmailQuerySchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": "Verification token is required",
    "any.required": "Verification token is required",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
  password: Joi.string().pattern(PASSWORD_REGEX).required().messages({
    "string.pattern.base": PASSWORD_RULE_MESSAGE,
    "any.required": "Password is required",
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string().pattern(PASSWORD_REGEX).required().messages({
    "string.pattern.base": PASSWORD_RULE_MESSAGE,
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "New Password and Confirm Password do not match",
      "any.required": "Confirm password is required",
    }),
});

const updateMeSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).optional(),
  phone: Joi.string().trim().min(7).max(20).optional().allow(null, ""),
})
  .or("full_name", "phone")
  .messages({
    "object.missing": "Full name or phone is required",
  });

module.exports = {
  registerUserSchema,
  loginUserSchema,
  emailSchema,
  verifyEmailQuerySchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateMeSchema,
};
