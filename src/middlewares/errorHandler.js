const ErrorTypes = require("../utils/errors/errorTypes");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Spausdina klaidą konsolėje (naudokite logavimo įrankius gamybos aplinkoje)
  if (process.env.NODE_DEBUG === "true") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      fields: err.details,
      message: err.message,
      stack: err.stack,
    });
  }

  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Neteisingas JSON formatas",
    });
  }

  if (
    err.errorType === ErrorTypes.VALIDATION_ERROR ||
    err.errorType === ErrorTypes.REQUIRED_FIELD_ERROR
  ) {
    return res.status(err.statusCode).json({
      message: err.message,
      fields: err.details,
    });
  }

  if (err && err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      fields: err.errors,
    });
  }

  if (err && err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error",
      fields: err.keyValue,
    });
  }

  if (err && err.name === "CastError") {
    return res.status(400).json({
      message: "Netinkamas ID tipas",
    });
  }

  // Atsakas gamybos aplinkoje
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Nežinomos klaidos
  // log.error(err);
  return res.status(500).json({
    status: "error",
    message: "Kažkas nutiko netinkamai",
  });
};

module.exports = errorHandler;
