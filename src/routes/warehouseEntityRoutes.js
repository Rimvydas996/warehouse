const express = require("express");
const router = express.Router();
const warehouseEntityController = require("../controllers/warehouseEntityController");

router.post("/", warehouseEntityController.createWarehouse);
router.get("/", warehouseEntityController.listMyWarehouses);
router.get("/current", warehouseEntityController.getCurrentWarehouse);
router.patch("/active", warehouseEntityController.setActiveWarehouse);
router.patch("/current/locations", warehouseEntityController.updateLocations);
router.post("/current/users", warehouseEntityController.addUser);
router.patch("/current/users/:userId", warehouseEntityController.updateUserRole);
router.delete("/current/users/:userId", warehouseEntityController.removeUser);

module.exports = router;
