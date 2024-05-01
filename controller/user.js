const User = require("../models/user");
const Story = require("../models/stories");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decodeJwtToken } = require("../middleware/tokenVerify");

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
    await User.findByIdAndUpdate(
      userId,

      {
        $addToSet: { userbookmarks: postId },
      }
    );
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
    const userToken = decodeJwtToken();
    console.log(req)
   const user = await User.findByIdAndUpdate(userId, {
      $addToSet: { userstories: postId },
    });

    let isEditable;
    if (userToken) {
      const ObjectId = mongoose.Types.ObjectId;
      const id = new ObjectId(userToken);
      if (id === user.refUserId) {
        isEditable = true;
      }
    }

    res.json({ user, isEditable: true });
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

// const deleteBookmark = async (req, res, next) => {
//   try {
//     const bookmarkId = req.bookmarkId; // Assuming the bookmark ID is passed in the URL
//     const deletedBookmark = await User.updateOne(
//       id,
//       { $pull: { bookmarks: bookmarkId } }
//     );
//     if (!deletedBookmark) {
//       return res.status(404).json({
//         errorMessage: "Bookmark not found",
//       });
//     }
//     res.json({ message: "Bookmark deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting bookmark:", error);
//     res.status(500).json({
//       errorMessage: "Server error",
//     });
//   }
// };

// const deleteUserBookmarks = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const postId = req.body.id;
//     const userToken = decodeJwtToken();
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $delete: { userbookmarks: postId },
//       },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({
//         errorMessage: "No user found",
//       });
//     }
//     let isEditable = false;
//     if (userToken) {
//       const ObjectId = mongoose.Types.ObjectId;
//       const id = new ObjectId(userToken);
//       if (id === user.refUserId) {
//         isEditable = true;
//       }
//     }
//     res.json({ user, isEditable });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       errorMessage: "Something went wrong",
//     });
//   }
// };

// const deleteUserBookmarks = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const postId = req.body.id;

//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         errorMessage: "No user found",
//       });
//     }

//     // Remove the postId from userbookmarks array
//     const index = user.userbookmarks.indexOf(postId);
//     if (index !== -1) {
//       user.userbookmarks.splice(index, 1);
//     }

//     // Save the updated user document
//     const updatedUser = await user.save();

//     let isEditable = false; // Initialize isEditable to false
//     const userToken = decodeJwtToken(); // Assuming you have a function to decode JWT token

//     if (userToken) {
//       // Check if the decoded token matches the user's reference ID
//       if (userToken === updatedUser.refUserId.toString()) {
//         isEditable = true;
//       }
//     }

//     res.json({ user: updatedUser, isEditable }); // Return the updated user and isEditable flag
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       errorMessage: "Something went wrong",
//     });
//   }
// };

const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const userToken = decodeJwtToken();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        errorMessage: "No user found",
      });
    }

    let isEditable;
    if (userToken) {
      const ObjectId = mongoose.Types.ObjectId;
      const id = new ObjectId(userToken);
      if (id === user.refUserId) {
        isEditable = true;
      }
    }

    res.json({ user, isEditable: true });
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
  getUserById,
  // deleteUserBookmarks,
};
