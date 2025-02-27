const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 255,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  interactedWith: new mongoose.Schema({
    users: [
      {
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
          trim: true,
        },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
  }),
});

const User = mongoose.model("User", userSchema);

module.exports = User;
