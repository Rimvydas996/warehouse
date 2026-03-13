const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");

router.get("/", warehouseController.getAllProducts);
router.post("/", warehouseController.addProduct);
router.get("/:id", warehouseController.getProductById);
router.patch("/:id", warehouseController.changeProductQuantity);
router.patch("/:id/adjust", warehouseController.adjustQuantity);
router.delete("/:id", warehouseController.removeProduct);

module.exports = router;
