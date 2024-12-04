const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseContoller");

router.put("/", warehouseController.addProduct);
router.put("/:id", warehouseController.changeProductQuantity);
router.get("/", warehouseController.getAlProducts);
router.get("/:id", warehouseController.getProductById);
router.patch("/remove/:id", warehouseController.removeFromQuantity);
router.patch("/add/:id", warehouseController.addToQuantity);

module.exports = router;
