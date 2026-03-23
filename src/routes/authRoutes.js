const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authorization = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/theme", authorization, authController.updateTheme);

module.exports = router;
