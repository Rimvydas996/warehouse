"use strict";

const mongoose = require("mongoose");

const warehouseItem = {
  title: { type: "string", required: true },
  quantity: { type: "number", required: true },
  supplyStatus: { type: "boolean", required: true },
  storageLocation: { type: "string", required: true },
};

const warehouseItemSchema = new mongoose.Schema(warehouseItem, {
  timestamps: true,
  versionKey: false,
});
module.exports = mongoose.model("WarehouseItem", warehouseItemSchema, "warehouseItems");
