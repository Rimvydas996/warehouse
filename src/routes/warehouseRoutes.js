const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseContoller");

router.post("/", warehouseController.addProduct);
router.patch("/:id/adjust", warehouseController.adjustQuantity);
router.get("/", warehouseController.getAlProducts);
router.get("/:id", warehouseController.getProductById);
router.patch("/:id", warehouseController.removeFromQuantity);

module.exports = router;
