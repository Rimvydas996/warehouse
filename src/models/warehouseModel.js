"use strict";

const mongoose = require("mongoose");

const warehouseItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    supplyStatus: { type: Boolean, required: true },
    storageLocation: { type: String, required: true, trim: true },
    refillThreshold: { type: Number, required: false, min: 0, default: 0 },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("WarehouseItem", warehouseItemSchema, "warehouseItems");
