const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "An unexpected error occurred";

  if (err.name === "MulterError") {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file is too large. Maximum size is 5MB."
        : err.message;
  } else if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Duplicate record already exists";
  }

  if (statusCode === 500) {
    console.error("Internal Server Error:", err);
    message = "Internal Server Error";
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors && Array.isArray(err.errors)) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
