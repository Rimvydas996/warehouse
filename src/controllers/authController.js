"use strict";

const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    return res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    return res.status(200).json(token);
  } catch (err) {
    return next(err);
  }
};

exports.updateTheme = async (req, res, next) => {
  try {
    const { themePreference } = req.body;
    const user = await authService.updateThemePreference(req.user, themePreference);
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};
