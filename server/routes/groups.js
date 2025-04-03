const express = require("express");
const Joi = require("joi");
const Group = require("../models/Group");
Joi.objectId = require("joi-objectid")(Joi);
const router = express.Router();

const validateCreateGroupInput = (input) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    users: Joi.array().items(Joi.objectId()).required(),
  });
  return schema.validate(input);
};
router.post("/", async (req, res) => {
  const { error } = validateCreateGroupInput(req.body);
  if (error)
    return res.status(400).json({ message: error.message });

  const group = new Group(req.body);
  try {
    const result = await group.save();
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong internally" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    res.json(group);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong internally" });
  }
});

module.exports = router;
