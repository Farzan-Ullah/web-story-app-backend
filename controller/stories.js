const Story = require("../models/stories");
const { decodeJwtToken } = require("../middleware/tokenVerify");

const createStories = async (req, res, next) => {
  try {
    const { heading, description, image, category } = req.body;

    if (!heading || !description || !image || !category) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const userId = req.userId;

    const storyDetails = new Story({
      heading,
      description,
      image,
      category,
      refUserId: userId,
    });

    await storyDetails.save();
    res.json({ message: "Story Created Successfully" });
  } catch (error) {
    next(error);
  }
};

const getFullStories = async (req, res, next) => {
  try {
    const stories = await Story.find();
    if (!stories) {
      return res.status(404).json({
        errorMessage: "No stories found",
      });
    }
    // Log the fetched stories
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

const getStoryById = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const userId = decodeJwtToken();
    const storyDetails = await Story.findById(storyId);

    if (!storyDetails) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    let isEditable;
    if (userId) {
      const ObjectId = mongoose.Types.ObjectId;
      const id = new ObjectId(userId);
      if (id === storyDetails.refUserId) {
        isEditable = true;
      }
    }

    res.json({ storyDetails, isEditable: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStories,
  getFullStories,
  getStoryById,
};
