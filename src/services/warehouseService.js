"use strict";

const mongoose = require("mongoose");
const warehouseRepository = require("../repositories/warehouseRepository");
const warehouseEntityRepository = require("../repositories/warehouseEntityRepository");
const warehouseMembershipRepository = require("../repositories/warehouseMembershipRepository");
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

const requireRole = (membership, roles) => {
  const role = membership?.role === "user" ? "member" : membership?.role;
  if (!roles.includes(role)) {
    throw new AppError("Neturite teisiu", 403, ErrorTypes.AUTHORIZATION_ERROR);
  }
};

const requireWarehouseForUser = async (user) => {
  if (!user || !user.activeWarehouseId) {
    throw new AppError("Vartotojas neturi aktyvaus sandelio", 400, ErrorTypes.VALIDATION_ERROR);
  }
  const warehouse = await warehouseEntityRepository.getWarehouseById(user.activeWarehouseId);
  if (!warehouse) {
    throw new AppError("Sandelys nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
  }
  const membership = await warehouseMembershipRepository.getMembership(user._id, warehouse._id);
  if (!membership) {
    throw new AppError("Neturite prieigos prie sandelio", 403, ErrorTypes.AUTHORIZATION_ERROR);
  }
  return warehouse;
};

const ensureLocationAllowed = (warehouse, location) => {
  if (!location) return;
  const normalized = String(location).trim();
  if (!normalized) {
    throw new AppError("Truksta storageLocation lauko", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
  }
  if (!warehouse.locations || !warehouse.locations.includes(normalized)) {
    throw new AppError("Neteisinga lokacija", 400, ErrorTypes.VALIDATION_ERROR);
  }
};

const warehouseService = {
  getAllProducts: async (user) => {
    const warehouse = await requireWarehouseForUser(user);
    return warehouseRepository.getAllProducts(warehouse._id);
  },

  getProductById: async (id, user) => {
    requireObjectId(id);
    const warehouse = await requireWarehouseForUser(user);
    const product = await warehouseRepository.getProductById(id, warehouse._id);
    if (!product) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return product;
  },

  createProduct: async ({ title, quantity, supplyStatus, storageLocation, refillThreshold }, user) => {
    const warehouse = await requireWarehouseForUser(user);

    if (!title || supplyStatus === undefined || supplyStatus === null || !storageLocation) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const normalizedQuantity = requireNumber(quantity, "Truksta quantity lauko");
    ensureLocationAllowed(warehouse, storageLocation);
    let normalizedThreshold = 0;
    if (refillThreshold !== undefined) {
      normalizedThreshold = requireNumber(refillThreshold, "Truksta refillThreshold lauko");
      if (normalizedThreshold < 0) {
        throw new AppError("Netinkamas refillThreshold", 400, ErrorTypes.VALIDATION_ERROR);
      }
    }

    return warehouseRepository.createProduct({
      title,
      quantity: normalizedQuantity,
      supplyStatus,
      storageLocation,
      refillThreshold: normalizedThreshold,
      warehouseId: warehouse._id,
    });
  },

  updateProduct: async (id, payload, user) => {
    requireObjectId(id);
    const warehouse = await requireWarehouseForUser(user);
    const membership = await warehouseMembershipRepository.getMembership(user._id, warehouse._id);
    const update = {};

    if (payload.quantity !== undefined) {
      update.quantity = requireNumber(payload.quantity, "Truksta quantity lauko");
    }

    if (payload.storageLocation !== undefined) {
      const location = String(payload.storageLocation).trim();
      if (!location) {
        throw new AppError("Truksta storageLocation lauko", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
      }
      ensureLocationAllowed(warehouse, location);
      update.storageLocation = location;
    }

    if (payload.refillThreshold !== undefined) {
      requireRole(membership, ["admin"]);
      const threshold = requireNumber(payload.refillThreshold, "Truksta refillThreshold lauko");
      if (threshold < 0) {
        throw new AppError("Netinkamas refillThreshold", 400, ErrorTypes.VALIDATION_ERROR);
      }
      update.refillThreshold = threshold;
    }

    if (!Object.keys(update).length) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const updated = await warehouseRepository.updateProduct(id, warehouse._id, update);
    if (!updated) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return updated;
  },

  adjustQuantity: async (id, delta, user) => {
    requireObjectId(id);
    const warehouse = await requireWarehouseForUser(user);
    const normalizedDelta = requireNumber(delta, "Truksta quantity lauko");
    const updated = await warehouseRepository.adjustQuantity(id, warehouse._id, normalizedDelta);
    if (!updated) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return updated;
  },

  removeProduct: async (id, user) => {
    requireObjectId(id);
    const warehouse = await requireWarehouseForUser(user);
    const removed = await warehouseRepository.removeProduct(id, warehouse._id);
    if (!removed) {
      throw new AppError("Elementas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }
    return removed;
  },
};

module.exports = warehouseService;
