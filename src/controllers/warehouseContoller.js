const Warehouse = require("../models/warehouseItem");
const mongoose = require("mongoose");

exports.getAlProducts = async (req, res) => {
  try {
    const products = await Warehouse.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Klaida skaitant duomenys" + err.toString() });
  }
};
exports.addProduct = async (req, res) => {
  try {
    const { title, quantity, supplyStatus, storageLocation } = req.body;
    if (!title || !quantity || !supplyStatus || !storageLocation) {
      return res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }
    const product = new Warehouse({ title, quantity, supplyStatus, storageLocation });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Klaida issaugant duomenis: " + err.toString() });
  }
};
exports.getProductById = async (req, res) => {
  const id = req.params.id;
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
};
exports.changeProductQuantity = async (req, res) => {
  try {
    if (!req.body.quantity) {
      res.status(400).json({ error: "Truksta quantity lauko" });
    }
    const id = req.params.id;
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
  const id = req.params.id;
  const { quantity } = req.body;
  await Warehouse.findByIdAndUpdate(id, { quantity });
  res.json({ massage: "Kiekis pakeistas" });
};
exports.changeQuantity = async (kriptis, zingsnis, id) => {
  try {
    if (!zingsnis) {
      return res.status(400).json({ error: "Nenurodytas kiekis" });
    }
    let abc = { quantity: +zingsnis };
    if (kriptis === "-") {
      abc = { quantity: -zingsnis };
    }
    const product = await Warehouse.findByIdAndUpdate(id, { $inc: abc }, { new: true, runValidators: true });

    return { product };
  } catch (err) {
    return { error: "Klaida " + err.toString() };
  }
};

exports.removeFromQuantity = async (req, res) => {
  return res.json(await this.changeQuantity("-", req.body.zingsnis, req.params.id));
};

exports.addToQuantity = async (req, res) => {
  return res.json(await this.changeQuantity("+", req.body.zingsnis, req.params.id));
};
