const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const isExistingUser = await User.findOne({ username: username });
    if (isExistingUser) {
      return res.status(409).json({ errorMessage: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      username,
      password: hashedPassword,
    });
    await userData.save();
    const token = jwt.sign(
      { userId: userData._id, name: userData.username },
      process.env.SECRET_CODE,
      { expiresIn: "60h" }
    );
    res.json({ message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

const updateUserBookmarks = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.id;
    await User.findByIdAndUpdate(userId, {
      $addToSet: { userbookmarks: postId },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

const updateUserLikes = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.id;
    await User.findByIdAndUpdate(userId, {
      $addToSet: { userlikes: postId },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

const updateUserStories = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.id;
    await User.findByIdAndUpdate(userId, {
      $addToSet: { userstories: postId },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        errorMessage: "Bad request! Invalid Credentials",
      });
    }

    const userDetails = await User.findOne({ username });
    if (!userDetails) {
      return res.status(401).json({ errorMessage: "User doesnt exist" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Password is not matched" });
    }

    const token = jwt.sign(
      { userId: userDetails._id, name: userDetails.username },
      process.env.SECRET_CODE,
      { expiresIn: "60h" }
    );

    res.json({
      message: "User logged in",
      token: token,
      name: userDetails.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await User.find();
    if (!bookmarks) {
      return res.status(404).json({
        errorMessage: "No stories found",
      });
    }
    // Log the fetched stories
    res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserBookmarks,
  updateUserLikes,
  updateUserStories,
  getBookmarks,
};
