"use strict";

const mongoose = require("mongoose");

const warehouseMembershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

warehouseMembershipSchema.index({ userId: 1, warehouseId: 1 }, { unique: true });

module.exports = mongoose.model("WarehouseMembership", warehouseMembershipSchema, "warehouseMemberships");
