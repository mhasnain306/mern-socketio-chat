const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
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
      email: result.email,
    };
    const token = jwt.sign(payload, "secretKey");

    res.header("x-auth-token", token).json(result);
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

const validateUpdateUserInput = (input) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    interactedUserName: Joi.string().min(3).required(),
    interactedUserId: Joi.objectId().required(),
  });

  return schema.validate(input);
};

router.put("/:id", async (req, res) => {
  const { error } = validateUpdateUserInput(req.body);
  if (error)
    return res.status(400).json({ message: error.message });
  try {
    let user = await User.findById(req.params.id);
    console.log("User from update user: ", user);
    console.log("the user body: ", req.body);

    user.name = req.body.name;
    user.email = req.body.email;
    const newInteractedUser = {
      name: req.body.interactedUserName,
      _id: req.body.interactedUserId,
    };
    user.interactedWith.push(newInteractedUser);
    console.log("the final user object to updated: ", user);

    user = await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong" });
  }
});

module.exports = router;
