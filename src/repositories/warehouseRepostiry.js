const { getProductById } = require("../controllers/warehouseContoller");
const Warehouse = require("../models/warehouseIModel");
const mongoose = require("mongoose");

const warehouseRepository = {
  getAlProducts: async (req, res) => {
    try {
      const products = await Warehouse.find({});
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Klaida skaitant duomenys" + err.toString() });
    }
  },
  addProduct: async (title, quantity, supplyStatus, storageLocation) => {
    try {
      const product = new Warehouse({ title, quantity, supplyStatus, storageLocation });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: "Klaida issaugant duomenis: " + err.toString() });
    }
  },
  getProductById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Netinkamas ID tipas" });
      }
      const product = await Warehouse.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Elementas nerastas" });
      }
      res.json(product);
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        res.status(404).json({ error: "Elementas nerastas" });
        return;
      }
      res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
  },
  changeProductQuantity: async (id, res) => {
    try {
      const product = await Warehouse.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Elementas nerastas" });
      }
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(404).json({ error: "Elementas nerastas" });
      }
      return res.status(500).json({ error: "Klaida atnaujinat duomenys" + product });
    }
    await Warehouse.findByIdAndUpdate(id, { quantity });
    res.json({ massage: "Kiekis pakeistas" });
  },
  adjustQuantity: async (kriptis, zingsnis, id) => {
    try {
      const product = await Warehouse.findByIdAndUpdate(id, { $inc: abc }, { new: true, runValidators: true });
      return { product };
    } catch (err) {
      return { error: "Klaida " + err.toString() };
    }
  },
};

module.exports = warehouseRepository;
