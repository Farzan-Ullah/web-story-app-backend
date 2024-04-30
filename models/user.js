const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requird: true,
      unique: true,
    },
    password: {
      type: String,
      requird: true,
    },
    userstories: {
      type: Array,
      required: true,
    },
    userbookmarks: {
      type: Array,
      requird: true,
    },
    userlikes: {
      type: Array,
      requird: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("User", userSchema);
