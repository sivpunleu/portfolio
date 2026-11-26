const validation = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  if (source === "body") {
    req.body = value;
  } else if (source === "query") {
    req.validatedQuery = value;
  }
  return next();
};

const validateIdParam = (paramName = "id") => (req, res, next) => {
  const raw = req.params[paramName];
  if (!/^\d+$/.test(String(raw)) || Number(raw) <= 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${paramName} parameter`,
    });
  }
  return next();
};

module.exports = validation;
module.exports.validateIdParam = validateIdParam;
