"use strict";

const warehouseEntityService = require("../services/warehouseEntityService");

exports.createWarehouse = async (req, res, next) => {
  try {
    const { name } = req.body;
    const warehouse = await warehouseEntityService.createWarehouse(name, req.user);
    return res.status(201).json(warehouse);
  } catch (error) {
    return next(error);
  }
};

exports.getCurrentWarehouse = async (req, res, next) => {
  try {
    const overview = await warehouseEntityService.getCurrentWarehouseOverview(req.user);
    return res.status(200).json(overview);
  } catch (error) {
    return next(error);
  }
};

exports.listMyWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseEntityService.listMyWarehouses(req.user);
    return res.status(200).json(warehouses);
  } catch (error) {
    return next(error);
  }
};

exports.setActiveWarehouse = async (req, res, next) => {
  try {
    const { warehouseId } = req.body;
    const updated = await warehouseEntityService.setActiveWarehouse(req.user, warehouseId);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.updateLocations = async (req, res, next) => {
  try {
    const updated = await warehouseEntityService.updateLocations(req.user, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.updateHomeContainers = async (req, res, next) => {
  try {
    const updated = await warehouseEntityService.updateHomeContainers(req.user, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.updateHomeContainerTasks = async (req, res, next) => {
  try {
    const updated = await warehouseEntityService.updateHomeContainerTasks(
      req.user,
      req.params.containerId,
      req.body
    );
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const member = await warehouseEntityService.addUserToWarehouse(req.user, req.body);
    return res.status(201).json(member);
  } catch (error) {
    return next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const updated = await warehouseEntityService.updateUserRole(req.user, req.params.userId, role);
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const result = await warehouseEntityService.removeUserFromWarehouse(req.user, req.params.userId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
