"use strict";

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Nera authorization headeriu" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Nera tokenu" });
    }

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ error: "Nerastas vartotojas" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Nepavyko prisijungti: " + err.toString() });
      }
    });
    req.user = user;
  } catch (error) {
    return res.status(500).json(err.toString());
  }
  next();
};

module.exports = authorize;
