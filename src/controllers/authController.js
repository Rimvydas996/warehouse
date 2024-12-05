"use strict";

const authRepository = require("../repositories/authRepository");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }
    authRepository.createUser(email, password);
  } catch (err) {
    res.status.json({ error: "Klaida issaugant duomenys" + err.toString() });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }

    const token = await authRepository.authenticateUser(email, password);

    res.status(201).json(token);
  } catch (err) {
    return res.status(500).json({ error: "Klaida jungiantis i sistema" + err.toString() });
  }
};
