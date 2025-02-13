"use strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// repositorijose neturi buti trycath dalies

const authRepository = {
  authenticateUser: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.token = token;

    await user.save();
    user.password = undefined;
    user.token = undefined;

    return { token: token, user: user };
  },
  createUser: async (email, password) => {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error({ error: "Toks vatotojas jau egzistuoja" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      return user;
    } catch (err) {
      throw new Error("Error saving user: " + err.message);
    }
  },
};

module.exports = authRepository;
