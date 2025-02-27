// const Warehouse = require("../models/warehouseItem");
const mongoose = require("mongoose");
const warehouseRepository = require("../repositories/warehouseRepostiry");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

exports.getAlProducts = async (req, res, next) => {
  const allProducts = await warehouseRepository.getAlProducts();
  res.status(201).json(allProducts);
};

exports.addProduct = (req, res, next) => {
  try {
    const { title, quantity, supplyStatus, storageLocation } = req.body;
    if (!title || !quantity || !supplyStatus || !storageLocation) {
      throw new AppError("Truksta lauku uzklausoje", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }
    warehouseRepository
      .addProduct(title, quantity, supplyStatus, storageLocation)
      .then((product) => {
        return res.status(201).json(product);
      });
  } catch (error) {
    next(error);
  }
  // catch (err) {
  // if (err.errorType === ErrorTypes.REQUIRED_FIELD_ERROR) {
  // throw err;
  // }
  // return res.status(500).json({ error: "Klaida issaugant duomenis: " + err.toString() });
  // }
};

exports.getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const getProductById = await warehouseRepository.getProductById(id);
    res.status(200).json(getProductById);
  } catch (err) {
    next(err);
  }
};

exports.changeProductQuantity = (req, res, next) => {
  try {
    if (!req.body.quantity) {
      throw new AppError("Truksta quantity lauko", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }
    const id = req.params.id;
    const { quantity } = req.body;
    warehouseRepository.changeProductQuantity(id, quantity).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    next(error);
  }
  // catch (err) {
  //   if (err.errorType === ErrorTypes.REQUIRED_FIELD_ERROR) {
  //     throw err;
  //   }
  //   return res.status(500).json({ error: "Klaida atnaujinat duomenys" + product });
  // }
};

exports.adjustQuantity = async (kriptis, zingsnis, id) => {
  if (!zingsnis) {
    throw new AppError("Nenurodytas kiekis", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
  }
  let abc = { quantity: +zingsnis };
  if (kriptis === "-") {
    abc = { quantity: -zingsnis };
  }
  return await warehouseRepository.adjustQuantity(id, abc);
};

exports.removeFromQuantity = async (req, res, next) => {
  try {
    const result = await this.adjustQuantity("-", req.body.zingsnis, req.params.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.addToQuantity = async (req, res, next) => {
  try {
    const result = await this.adjustQuantity("+", req.body.zingsnis, req.params.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const warehouse = await warehouseRepository.getProductById(id);

    if (!warehouse) {
      return res.status(404).json({ error: "Elementas nerastas" });
    }

    await warehouseRepository.removeProduct(id);
    res.status(204).json("istrinta sekmingai");
  } catch (err) {
    next(err); // Perduodame klaidą į error handling middleware
  }
};
// const id = req.params.id;
// if (!id) {
//   throw new AppError("Id laukelis", 400, ErrorTypes.NOT_FOUND_ERROR);
// }
// warehouseRepository
//   .removeProduct(id)
//   .then(() => {
//     return res.json("Istrinta sekmingai");
//   })
//   .catch((err) => res.status(err.statusCode).json({ message: err.message }));
// };
