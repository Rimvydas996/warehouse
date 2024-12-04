"use strict";

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    token: { type: "string", require: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    premission: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema, "users");
