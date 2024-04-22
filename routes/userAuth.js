const express = require("express");
const router = express.Router();
const userAuthController = require("../controller/user");

router.post("/register", userAuthController.registerUser);
// router.post("/login", authController.loginUser);

module.exports = router;
