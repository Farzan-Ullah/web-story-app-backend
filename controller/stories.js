const Story = require("../models/stories");

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

module.exports = {
  createStories,
};
