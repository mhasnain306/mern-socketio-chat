const mongoose = require("mongoose");
const { userSchema } = require("./User");

const Group = mongoose.model(
  "Group",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  })
);

module.exports = Group;
