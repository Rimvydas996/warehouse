"use strict";

const warehouseService = require("../services/warehouseService");

exports.getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await warehouseService.getAllProducts();
    return res.status(200).json(allProducts);
  } catch (err) {
    return next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const product = await warehouseService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await warehouseService.getProductById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await warehouseService.updateProduct(req.params.id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.adjustQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const updated = await warehouseService.adjustQuantity(req.params.id, quantity);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    await warehouseService.removeProduct(req.params.id);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};
