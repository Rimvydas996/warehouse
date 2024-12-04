const Warehouse = require("../models/warehouseItem");
const mongoose = require("mongoose");
const warehouseRepository = require("../repositories/warehouseRepostiry");

exports.getAlProducts = async (req, res) => {
  warehouseRepository.getAlProducts();
};
exports.addProduct = async (req, res) => {
  try {
    const { title, quantity, supplyStatus, storageLocation } = req.body;
    if (!title || !quantity || !supplyStatus || !storageLocation) {
      return res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }
    warehouseRepository.addProduct(title, quantity, supplyStatus, storageLocation);
  } catch (err) {
    res.status(500).json({ error: "Klaida issaugant duomenis: " + err.toString() });
  }
};
exports.getProductById = async (req, res) => {
  const id = req.params.id;
  warehouseRepository.getProductById(id);
};
exports.changeProductQuantity = async (req, res) => {
  try {
    if (!req.body.quantity) {
      res.status(400).json({ error: "Truksta quantity lauko" });
    }
    const id = req.params.id;
  } catch (err) {
    return res.status(500).json({ error: "Klaida atnaujinat duomenys" + product });
  }
  const { quantity } = req.body;
  warehouseRepository.changeProductQuantity(id, quantity);
};
exports.adjustQuantity = async (kriptis, zingsnis, id) => {
  try {
    if (!zingsnis) {
      return res.status(400).json({ error: "Nenurodytas kiekis" });
    }
    let abc = { quantity: +zingsnis };
    if (kriptis === "-") {
      abc = { quantity: -zingsnis };
    }
    warehouseRepository.adjustQuantity(abc);
  } catch (err) {
    return { error: "Klaida " + err.toString() };
  }
};

exports.removeFromQuantity = async (req, res) => {
  return res.json(await this.adjustQuantity("-", req.body.zingsnis, req.params.id));
};

exports.addToQuantity = async (req, res) => {
  return res.json(await this.adjustQuantity("+", req.body.zingsnis, req.params.id));
};
