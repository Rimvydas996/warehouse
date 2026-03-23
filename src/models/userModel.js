"use strict";

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[\w\W]{6,}$/.test(v);
        },
        message: "Password must contain at least one letter and one number",
      },
    },
    token: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "manager", "member", "user"],
      default: "member",
    },
    themePreference: {
      type: String,
      default: "sunrise",
    },
    activeWarehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: false },
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
