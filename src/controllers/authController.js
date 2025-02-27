"use strict";

const authRepository = require("../repositories/authRepository");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.VALIDATION_ERROR);
    }
    if (!passwordRegex.test(password)) {
      throw new AppError(
        "Slaptažodis turi būti bent 6 simbolių ilgio ir turėti bent vieną raidę ir skaičių",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }
    if (!emailRegex.test(email)) {
      throw new AppError("Iveskite tinkamą el_pastą", 400, ErrorTypes.VALIDATION_ERROR);
    }
    if (password.toLowerCase().includes(email.split("@")[0])) {
      throw new AppError(
        "Password cannot contain email username",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }

    const user = await authRepository.createUser(email, password);
    res.status(201).json({
      status: "success",
      data: user,
    });
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
