"use strict";

const User = require("../models/userModel");
const warehouseEntityRepository = require("../repositories/warehouseEntityRepository");
const warehouseRepository = require("../repositories/warehouseRepository");
const warehouseMembershipRepository = require("../repositories/warehouseMembershipRepository");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

const normalizeRole = (role) => (role === "user" ? "member" : role);

const requireRole = (membership, roles) => {
  const role = normalizeRole(membership?.role);
  if (!roles.includes(role)) {
    throw new AppError("Neturite teisiu", 403, ErrorTypes.AUTHORIZATION_ERROR);
  }
};

const requireActiveWarehouse = async (user) => {
  if (!user?.activeWarehouseId) {
    throw new AppError("Vartotojas neturi aktyvaus sandelio", 400, ErrorTypes.VALIDATION_ERROR);
  }
  const warehouse = await warehouseEntityRepository.getWarehouseById(user.activeWarehouseId);
  if (!warehouse) {
    throw new AppError("Sandelys nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
  }
  return warehouse;
};

const requireMembership = async (user, warehouseId) => {
  const membership = await warehouseMembershipRepository.getMembership(user._id, warehouseId);
  if (!membership) {
    throw new AppError("Neturite prieigos prie sandelio", 403, ErrorTypes.AUTHORIZATION_ERROR);
  }
  return membership;
};

const warehouseEntityService = {
  createWarehouse: async (name, user) => {
    if (!name || !String(name).trim()) {
      throw new AppError("Truksta pavadinimo", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const warehouse = await warehouseEntityRepository.createWarehouse({
      name: String(name).trim(),
      ownerId: user._id,
      locations: [],
      homeContainers: [],
    });

    await warehouseMembershipRepository.createMembership({
      userId: user._id,
      warehouseId: warehouse._id,
      role: "admin",
    });

    user.activeWarehouseId = warehouse._id;
    if (!user.role || user.role === "user") {
      user.role = "member";
    }
    await user.save();

    return warehouse;
  },

  getCurrentWarehouseOverview: async (user) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin", "manager", "member"]);

    const memberships = await warehouseMembershipRepository.listMembershipsByWarehouse(
      warehouse._id
    );
    const memberUsers = await User.find({
      _id: { $in: memberships.map((m) => m.userId) },
    }).select("email");
    const userMap = new Map(memberUsers.map((member) => [String(member._id), member]));
    const products = await warehouseRepository.getAllProducts(warehouse._id);

    return {
      warehouse,
      members: memberships.map((member) => ({
        _id: member.userId,
        email: userMap.get(String(member.userId))?.email ?? "Unknown",
        role: normalizeRole(member.role),
      })),
      products,
    };
  },

  updateLocations: async (user, { add = [], remove = [] }) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin", "manager"]);

    const addSet = new Set(add.map((loc) => String(loc).trim()).filter(Boolean));
    const removeSet = new Set(remove.map((loc) => String(loc).trim()).filter(Boolean));

    if (removeSet.size) {
      const products = await warehouseRepository.getAllProducts(warehouse._id);
      const inUse = new Set(products.map((product) => product.storageLocation));
      const blocked = Array.from(removeSet).filter((loc) => inUse.has(loc));
      if (blocked.length) {
        throw new AppError(
          "Negalima salinti lokacijos kuri naudojama produktuose",
          400,
          ErrorTypes.VALIDATION_ERROR
        );
      }
    }

    const currentLocations = new Set(warehouse.locations || []);

    removeSet.forEach((loc) => currentLocations.delete(loc));
    addSet.forEach((loc) => currentLocations.add(loc));

    const updated = await warehouseEntityRepository.updateWarehouseLocations(
      warehouse._id,
      Array.from(currentLocations)
    );

    return updated;
  },

  updateHomeContainers: async (user, { add = [], remove = [] }) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin", "manager"]);

    const normalizedAdd = (Array.isArray(add) ? add : [])
      .map((item) => ({
        title: String(item?.title ?? "").trim(),
        description: String(item?.description ?? "").trim(),
        tasks: String(item?.tasks ?? "").trim(),
      }))
      .filter((item) => item.title && item.description && item.tasks);

    if ((Array.isArray(add) && add.length > 0 && normalizedAdd.length === 0) || !Array.isArray(add)) {
      throw new AppError(
        "Truksta konteineriu duomenu",
        400,
        ErrorTypes.REQUIRED_FIELD_ERROR
      );
    }

    const removeSet = new Set(
      (Array.isArray(remove) ? remove : []).map((id) => String(id).trim()).filter(Boolean)
    );

    if (!Array.isArray(remove)) {
      throw new AppError(
        "Neteisingi konteineriu ID",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }

    const currentContainers = Array.isArray(warehouse.homeContainers)
      ? warehouse.homeContainers.filter((item) => !removeSet.has(String(item._id)))
      : [];

    warehouse.homeContainers = [...currentContainers, ...normalizedAdd];
    const updated = await warehouse.save();
    return updated;
  },

  updateHomeContainerTasks: async (user, containerId, { tasks }) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin", "manager"]);

    if (!containerId) {
      throw new AppError("Truksta konteinerio ID", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const normalizedTasks = String(tasks ?? "").trim();
    if (!normalizedTasks) {
      throw new AppError("Truksta uzduociu", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const container = warehouse.homeContainers?.id(containerId);
    if (!container) {
      throw new AppError("Konteineris nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }

    container.tasks = normalizedTasks;
    const updated = await warehouse.save();
    return updated;
  },

  addUserToWarehouse: async (user, { email, role }) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin"]);

    if (!email) {
      throw new AppError("Truksta el_pasto", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    const targetUser = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!targetUser) {
      throw new AppError("Vartotojas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }

    const normalizedRole = normalizeRole(role || "member");
    if (!["manager", "member"].includes(normalizedRole)) {
      throw new AppError("Neteisinga role", 400, ErrorTypes.VALIDATION_ERROR);
    }

    const existingMembership = await warehouseMembershipRepository.getMembership(
      targetUser._id,
      warehouse._id
    );
    if (existingMembership) {
      throw new AppError("Vartotojas jau priskirtas siame sandelyje", 400, ErrorTypes.VALIDATION_ERROR);
    }

    await warehouseMembershipRepository.createMembership({
      userId: targetUser._id,
      warehouseId: warehouse._id,
      role: normalizedRole,
    });

    return {
      _id: targetUser._id,
      email: targetUser.email,
      role: normalizedRole,
    };
  },

  updateUserRole: async (user, targetUserId, role) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin"]);

    if (!targetUserId) {
      throw new AppError("Truksta vartotojo ID", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    if (String(targetUserId) === String(user._id)) {
      throw new AppError("Negalite keisti savo roles", 400, ErrorTypes.VALIDATION_ERROR);
    }

    const normalizedRole = normalizeRole(role);
    if (!["manager", "member"].includes(normalizedRole)) {
      throw new AppError("Neteisinga role", 400, ErrorTypes.VALIDATION_ERROR);
    }

    const updated = await warehouseMembershipRepository.updateRole(
      targetUserId,
      warehouse._id,
      normalizedRole
    );
    if (!updated) {
      throw new AppError("Vartotojas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }

    const targetUser = await User.findById(updated.userId).select("email");
    return {
      _id: updated.userId,
      email: targetUser?.email ?? "Unknown",
      role: normalizedRole,
    };
  },

  removeUserFromWarehouse: async (user, targetUserId) => {
    const warehouse = await requireActiveWarehouse(user);
    const membership = await requireMembership(user, warehouse._id);
    requireRole(membership, ["admin"]);

    if (!targetUserId) {
      throw new AppError("Truksta vartotojo ID", 400, ErrorTypes.REQUIRED_FIELD_ERROR);
    }

    if (String(targetUserId) === String(user._id)) {
      throw new AppError("Negalite pasalinti saves", 400, ErrorTypes.VALIDATION_ERROR);
    }

    const removed = await warehouseMembershipRepository.removeMembership(
      targetUserId,
      warehouse._id
    );
    if (!removed) {
      throw new AppError("Vartotojas nerastas", 404, ErrorTypes.NOT_FOUND_ERROR);
    }

    const targetUser = await User.findById(targetUserId);
    if (targetUser && String(targetUser.activeWarehouseId || "") === String(warehouse._id)) {
      targetUser.activeWarehouseId = null;
      await targetUser.save();
    }

    return { success: true };
  },

  listMyWarehouses: async (user) => {
    const memberships = await warehouseMembershipRepository.listMembershipsByUser(user._id);
    const warehouses = await Promise.all(
      memberships.map((membership) =>
        warehouseEntityRepository.getWarehouseById(membership.warehouseId)
      )
    );
    return memberships
      .map((membership, index) => ({
        warehouse: warehouses[index],
        role: normalizeRole(membership.role),
        isActive: String(user.activeWarehouseId || "") === String(membership.warehouseId),
      }))
      .filter((entry) => entry.warehouse);
  },

  setActiveWarehouse: async (user, warehouseId) => {
    const membership = await requireMembership(user, warehouseId);
    requireRole(membership, ["admin", "manager", "member"]);

    user.activeWarehouseId = warehouseId;
    await user.save();

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      activeWarehouseId: user.activeWarehouseId,
    };
  },
};

module.exports = warehouseEntityService;
