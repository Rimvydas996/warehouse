"use strict";

const authRepository = require("../repositories/authRepository");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailPassword = (email, password) => {
  if (!email || !password) {
    throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.VALIDATION_ERROR);
  }

  if (!emailRegex.test(email)) {
    throw new AppError("Iveskite tinkamą el_pastą", 400, ErrorTypes.VALIDATION_ERROR);
  }

  if (!passwordRegex.test(password)) {
    throw new AppError(
      "Slaptažodis turi būti bent 6 simbolių ilgio ir turėti bent vieną raidę ir skaičių",
      400,
      ErrorTypes.VALIDATION_ERROR
    );
  }

  if (password.toLowerCase().includes(email.split("@")[0])) {
    throw new AppError("Password cannot contain email username", 400, ErrorTypes.VALIDATION_ERROR);
  }
};

const authService = {
  register: async (email, password) => {
    validateEmailPassword(email, password);
    return authRepository.createUser(email, password);
  },
  login: async (email, password) => {
    if (!email || !password) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.VALIDATION_ERROR);
    }
    return authRepository.authenticateUser(email, password);
  },
};

module.exports = authService;
