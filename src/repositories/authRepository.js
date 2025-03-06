"use strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

const authRepository = {
  authenticateUser: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Vartotojas nerastas", 401, ErrorTypes.VALIDATION_ERROR);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Neteisingas slaptažodis", 401, ErrorTypes.VALIDATION_ERROR);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.token = token;
    await user.save();

    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  },

  createUser: async (email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        "Vartotojas su tokiu el. paštu jau egzistuoja",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      return {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
      };
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new AppError(
          `Validacijos klaida: ${Object.values(error.errors)
            .map((err) => err.message)
            .join(", ")}`,
          400,
          ErrorTypes.VALIDATION_ERROR
        );
      }
      throw new AppError("Įvyko klaida kuriant vartotoją", 500, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
};

module.exports = authRepository;
