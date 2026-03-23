"use strict";

const Warehouse = require("../models/warehouseEntityModel");

const warehouseEntityRepository = {
  createWarehouse: async (payload) => {
    const warehouse = new Warehouse(payload);
    await warehouse.save();
    return warehouse;
  },
  getWarehouseById: async (id) => {
    return Warehouse.findById(id);
  },
  updateWarehouseLocations: async (id, locations) => {
    return Warehouse.findByIdAndUpdate(
      id,
      { locations },
      { new: true, runValidators: true }
    );
  },
};

module.exports = warehouseEntityRepository;
