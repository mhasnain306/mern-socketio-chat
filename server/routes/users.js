const express = require("express");
const Joi = require("joi");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

const validateCreateUserInput = (input) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(input);
};

router.post("/", async (req, res) => {
  const { error } = validateCreateUserInput(req.body);
  if (error)
    return res.status(400).json({ message: error.message });
  const user = new User(req.body);
  const result = await user.save();
  if (result) {
    const payload = {
      _id: result._id,
      name: result.name,
    };
    const token = jwt.sign(payload, "secretKey");

    res.header("x-auth-token", token).json(result);
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
