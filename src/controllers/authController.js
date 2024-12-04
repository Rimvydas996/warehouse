"use strict";

const authRepository = require("../repositories/authRepository");

// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const authRepository = require("../repositories/authRepository");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }
    authRepository.createUser(email, password);
    //   const existingUser = await User.findOne({ email });
    //   if (existingUser) {
    //     res.status(400).json({ error: "Toks vatotojas jau egzistuoja" });
    //   }
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const user = new User({ email, password: hashedPassword });
    //   await user.save();
    //   res.status(201).json(user);
    // } catch (err) {
    //   res.status.json({ error: "Klaida issaugant duomenys" + err.toString() });
    // }
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
    authRepository.findUserByEmail(email);
    //   const user = await User.findOne({ email });
    //   if (!user || !bcrypt.compareSync(password, user.password)) {
    //     return res.status(401).json({ message: "neteisingi prisijungimo duomenys" + user + password });
    //   }
    //   const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "20m" });
    //   user.token = token;
    //   await user.save();
    //   res.status(201).json({ token: token });
    // } catch (err) {
    //   return res.status(500).json({ error: "Klaida jungiantis i sistema" + err.toString() });
    // }
  } catch (err) {
    return res.status(500).json({ error: "Klaida jungiantis i sistema" + err.toString() });
  }
};
