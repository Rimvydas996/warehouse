"use strict";

const authRepository = require("../repositories/authRepository");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.VALIDATION_ERROR);
    }
    authRepository.createUser(email, password);
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.VALIDATION_ERROR);
    }

    const token = await authRepository.authenticateUser(email, password);

    if (!token) {
      throw new AppError("Blogi prisijungimo duomenys ", 401, ErrorTypes.VALIDATION_ERROR);
    }
    return res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};
