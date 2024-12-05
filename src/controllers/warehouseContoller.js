// const Warehouse = require("../models/warehouseItem");
const mongoose = require("mongoose");
const warehouseRepository = require("../repositories/warehouseRepostiry");

exports.getAlProducts = async (req, res) => {
  const allProducts = await warehouseRepository.getAlProducts();
  res.status(201).json(allProducts);
};

exports.addProduct = async (req, res) => {
  try {
    const { title, quantity, supplyStatus, storageLocation } = req.body;
    if (!title || !quantity || !supplyStatus || !storageLocation) {
      return res.status(400).json({ error: "Truksta lauku uzklausoje" });
    }
    const product = await warehouseRepository.addProduct(title, quantity, supplyStatus, storageLocation);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Klaida issaugant duomenis: " + err.toString() });
  }
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;
  const getProductById = await warehouseRepository.getProductById(id);
  res.status(200).json(getProductById);
};

exports.changeProductQuantity = async (req, res) => {
  try {
    if (!req.body.quantity) {
      res.status(400).json({ error: "Truksta quantity lauko" });
    }
    const id = req.params.id;
    const { quantity } = req.body;
    res.status(200).json(await warehouseRepository.changeProductQuantity(id, quantity));
  } catch (err) {
    return res.status(500).json({ error: "Klaida atnaujinat duomenys" + product });
  }
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
    return await warehouseRepository.adjustQuantity(id, abc);
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
exports.removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Produktas nerastas" });
    }
    await warehouseRepository.removeProduct(id);
    return res.json("Istrinta sekmingai");
  } catch (err) {
    res.status(500).json({ error: "Klaida panaikinant produkta" });
  }
};
