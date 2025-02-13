class AppError extends Error {
  constructor(message, statusCode, errorType = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = this.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
