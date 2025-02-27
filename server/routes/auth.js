const express = require("express");
const Joi = require("joi");
const User = require("../models/User");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const router = express.Router();

const validateSignInUserInput = (input) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(input);
};

router.post("/", async (req, res) => {
  const { error } = validateSignInUserInput(req.body);
  if (error)
    return res.status(400).json({ message: error.message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Email or Password is not valid" });
  if (user.password !== req.body.password)
    return res
      .status(400)
      .json({ message: "Email or Password is not valid" });

  const payload = {
    _id: user._id,
    name: user.name,
  };

  const token = jwt.sign(payload, "secretKey");

  res
    .header("x-auth-token", token)
    .json(_.pick(user, ["name", "email"]));
});
module.exports = router;
