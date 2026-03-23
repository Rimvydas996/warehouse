"use strict";

const warehouseService = require("../services/warehouseService");

exports.getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await warehouseService.getAllProducts(req.user);
    return res.status(200).json(allProducts);
  } catch (err) {
    return next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const product = await warehouseService.createProduct(req.body, req.user);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await warehouseService.getProductById(req.params.id, req.user);
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await warehouseService.updateProduct(req.params.id, req.body, req.user);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.adjustQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const updated = await warehouseService.adjustQuantity(req.params.id, quantity, req.user);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    await warehouseService.removeProduct(req.params.id, req.user);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};
