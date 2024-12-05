const { getProductById, removeProduct } = require("../controllers/warehouseContoller");
const Warehouse = require("../models/warehouseIModel");
const mongoose = require("mongoose");

const warehouseRepository = {
  getAlProducts: async (req, res) => {
    try {
      const products = await Warehouse.find({});
      // res.json(products);
      return products;
    } catch (err) {
      throw new Error("Klaida skaitant duomenys" + err.massage);
    }
  },
  addProduct: async (title, quantity, supplyStatus, storageLocation) => {
    try {
      const product = new Warehouse({ title, quantity, supplyStatus, storageLocation });
      await product.save();
      return product;
    } catch (err) {
      throw new Error("Klaida issaugant duomenis: " + err.massage);
    }
  },
  getProductById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Netinkamas ID tipas");
      }
      const product = await Warehouse.findById(id);
      if (!product) {
        throw new Error("Elementas nerastas");
      }
      return product;
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        throw new Error("Elementas nerastas" + err.massege);
      }
      throw new Error("Klaida skaitant duomenis");
    }
  },
  changeProductQuantity: async (id, quantity) => {
    try {
      return await Warehouse.findByIdAndUpdate(id, { quantity }, { new: true });
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        throw new Error("Elementas nerastas");
      }
      throw new Error("Klaida atnaujinat duomenys");
    }
  },
  adjustQuantity: async (id, abc) => {
    try {
      const product = await Warehouse.findByIdAndUpdate(id, { $inc: abc }, { new: true, runValidators: true });
      return product;
    } catch (err) {
      throw new Error("Klaida " + err.massage);
    }
  },
  removeProduct: async (id) => {
    await Warehouse.findByIdAndDelete(id);
  },
};

module.exports = warehouseRepository;
