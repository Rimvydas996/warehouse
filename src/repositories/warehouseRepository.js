const Warehouse = require("../models/warehouseModel");

const warehouseRepository = {
  getAllProducts: async (warehouseId) => {
    return Warehouse.find({ warehouseId }).lean();
  },
  createProduct: async (payload) => {
    const product = new Warehouse(payload);
    await product.save();
    return product;
  },
  getProductById: async (id, warehouseId) => {
    return Warehouse.findOne({ _id: id, warehouseId });
  },
  updateProduct: async (id, warehouseId, update) => {
    return Warehouse.findOneAndUpdate({ _id: id, warehouseId }, update, {
      new: true,
      runValidators: true,
    });
  },
  adjustQuantity: async (id, warehouseId, delta) => {
    return Warehouse.findOneAndUpdate(
      { _id: id, warehouseId },
      { $inc: { quantity: delta } },
      { new: true, runValidators: true }
    );
  },
  removeProduct: async (id, warehouseId) => {
    return Warehouse.findOneAndDelete({ _id: id, warehouseId });
  },
};

module.exports = warehouseRepository;
