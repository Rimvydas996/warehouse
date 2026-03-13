"use strict";

const mongoose = require("mongoose");
const warehouseRepository = require("../repositories/warehouseRepository");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

const requireObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Netinkamas ID tipas", 400, ErrorTypes.VALIDATION_ERROR);
  }
};

const requireNumber = (value, message) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new AppError(message, 400, ErrorTypes.REQUIRED_FIELD_ERROR);
  }
  return num;
};

const warehouseService = {
  getAllProducts: async () => {
    return warehouseRepository.getAllProducts();
  },

  getProductById: async (id) => {
    requireObjectId(id);
    const product = await warehouseRepository.getProductById(id);
    if (!product) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return product;
  },

  createProduct: async ({ title, quantity, supplyStatus, storageLocation }) => {
    if (!title || supplyStatus === undefined || supplyStatus === null || !storageLocation) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const normalizedQuantity = requireNumber(quantity, "Truksta quantity lauko");

    return warehouseRepository.createProduct({
      title,
      quantity: normalizedQuantity,
      supplyStatus,
      storageLocation,
    });
  },

  changeProductQuantity: async (id, quantity) => {
    requireObjectId(id);
    const normalizedQuantity = requireNumber(quantity, "Truksta quantity lauko");
    const updated = await warehouseRepository.updateProductQuantity(id, normalizedQuantity);
    if (!updated) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return updated;
  },

  adjustQuantity: async (id, delta) => {
    requireObjectId(id);
    const normalizedDelta = requireNumber(delta, "Truksta quantity lauko");
    const updated = await warehouseRepository.adjustQuantity(id, normalizedDelta);
    if (!updated) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return updated;
  },

  removeProduct: async (id) => {
    requireObjectId(id);
    const removed = await warehouseRepository.removeProduct(id);
    if (!removed) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return removed;
  },
};

module.exports = warehouseService;
