"use strict";

const WarehouseMembership = require("../models/warehouseMembershipModel");

const warehouseMembershipRepository = {
  createMembership: async (payload) => {
    const membership = new WarehouseMembership(payload);
    await membership.save();
    return membership;
  },
  getMembership: async (userId, warehouseId) => {
    return WarehouseMembership.findOne({ userId, warehouseId });
  },
  listMembershipsByUser: async (userId) => {
    return WarehouseMembership.find({ userId });
  },
  listMembershipsByWarehouse: async (warehouseId) => {
    return WarehouseMembership.find({ warehouseId });
  },
  updateRole: async (userId, warehouseId, role) => {
    return WarehouseMembership.findOneAndUpdate(
      { userId, warehouseId },
      { role },
      { new: true, runValidators: true }
    );
  },
  removeMembership: async (userId, warehouseId) => {
    return WarehouseMembership.findOneAndDelete({ userId, warehouseId });
  },
};

module.exports = warehouseMembershipRepository;
