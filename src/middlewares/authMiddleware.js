"use strict";

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Nera authorization headeriu", 401, ErrorTypes.AUTHENTICATION_ERROR);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Nera tokenu", 401, ErrorTypes.AUTHENTICATION_ERROR);
    }

    const user = await User.findOne({ token });

    if (!user) {
      throw new AppError("Nerastas vartotojas", 401, ErrorTypes.AUTHENTICATION_ERROR);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError("Server configuration error", 500, ErrorTypes.UNKNOWN_ERROR);
    }

    jwt.verify(token, jwtSecret);
    req.user = user;

    return next();
  } catch (error) {
    if (error && (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")) {
      return next(new AppError("Nepavyko prisijungti", 401, ErrorTypes.AUTHENTICATION_ERROR));
    }
    return next(error);
  }
};

module.exports = authorize;
