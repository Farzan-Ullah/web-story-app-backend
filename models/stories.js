const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  heading: {
    type: Array,
    required: true,
  },
  description: {
    type: Array,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Story", storySchema);
