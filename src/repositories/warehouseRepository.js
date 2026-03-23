const Warehouse = require("../models/warehouseModel");

const warehouseRepository = {
  getAllProducts: async () => {
    return Warehouse.find({}).lean();
  },
  createProduct: async (payload) => {
    const product = new Warehouse(payload);
    await product.save();
    return product;
  },
  getProductById: async (id) => {
    return Warehouse.findById(id);
  },
  updateProduct: async (id, update) => {
    return Warehouse.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },
  adjustQuantity: async (id, delta) => {
    return Warehouse.findByIdAndUpdate(
      id,
      { $inc: { quantity: delta } },
      { new: true, runValidators: true }
    );
  },
  removeProduct: async (id) => {
    return Warehouse.findByIdAndDelete(id);
  },
};

module.exports = warehouseRepository;
