const express = require("express");
const router = express.Router();
const storiesController = require("../controller/stories");
const { verifyToken } = require("../middleware/tokenVerify");

router.post("/create", verifyToken, storiesController.createStories);
router.get("/stories", storiesController.getFullStories);

module.exports = router;
