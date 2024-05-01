const express = require("express");
const router = express.Router();
const userAuthController = require("../controller/user");
const { verifyToken } = require("../middleware/tokenVerify");

router.post("/register", userAuthController.registerUser);
router.post("/login", userAuthController.loginUser);
router.get("/userdetails/:userId", verifyToken, userAuthController.getUserById);
router.put(
  "/addBookmarks/:id",
  verifyToken,
  userAuthController.updateUserBookmarks
);

// router.delete(
//   "/userdetails/:userId/deletebookmarks/:id",
//   verifyToken,
//   userAuthController.deleteUserBookmarks
// );
router.put("/addlikes/:id", verifyToken, userAuthController.updateUserLikes);

router.put(
  "/userstories/:id",
  verifyToken,
  userAuthController.updateUserStories
);

router.get("/getbookmarks", verifyToken, userAuthController.getBookmarks);
// router.get("/getlikes", verifyToken, userAuthController.getLikes);

module.exports = router;
