"use strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = {
  authenticateUser: async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "neteisingi prisijungimo duomenys" + user + password });
      }
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "20m" });
      user.token = token;
      await user.save();
      user.password = undefined;
      user.token = undefined;
      return { token: token, user: user };
    } catch (err) {
      throw new Error("Klaida jungiantis i sistema" + err.message);
    }
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
