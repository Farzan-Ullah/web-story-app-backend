const express = require("express");
const router = express.Router();
const storiesController = require("../controller/stories");
const { verifyToken } = require("../middleware/tokenVerify");

router.post("/create", verifyToken, storiesController.createStories);

module.exports = router;
