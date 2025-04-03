const express = require("express");
const Joi = require("joi");
const Message = require("../models/Message");
Joi.objectId = require("joi-objectid")(Joi);
const router = express.Router();

const validateSaveMessageInput = (input) => {
  const schema = Joi.object({
    message: Joi.string().required().min(2),
    from: Joi.objectId().required(),
    to: Joi.objectId().required(),
    sentAt: Joi.date().required(),
    delivered: Joi.string()
      .valid("server", "recipient")
      .required(),
  });

  return schema.validate(input);
};

const validateGetMessageInput = (input) => {
  const schema = Joi.object({
    user1: Joi.objectId().required(),
    user2: Joi.objectId().required(),
  });

  return schema.validate(input);
};
router.post("/", async (req, res) => {
  const { error } = validateSaveMessageInput(req.body);
  if (error)
    return res.status(400).json({ message: error.message });

  const newMessage = new Message(req.body);
  try {
    const result = await newMessage.save();
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
});

router.get("/:user1/:user2", async (req, res) => {
  const msgbody = {
    user1: req.params.user1,
    user2: req.params.user2,
  };
  const { error } = validateGetMessageInput(msgbody);
  if (error)
    return res.status(400).json({ message: error.message });
  try {
    const messages = await Message.find({
      $or: [
        {
          $and: [
            { from: req.params.user1 },
            { to: req.params.user2 },
          ],
        },
        {
          $and: [
            { from: req.params.user2 },
            { to: req.params.user1 },
          ],
        },
      ],
    });
    res.json(messages);
  } catch (error) {
    if (error instanceof Error)
      res.json({ message: error.message });
  }
});

const validateId = (id) => {
  console.log(id);
  const schema = Joi.objectId().required();
  return schema.validate(id);
};

router.put("/:id", async (req, res) => {
  const { error: idError } = validateId(req.params.id);
  const { error } = validateSaveMessageInput(req.body);
  if (error || idError)
    return res.status(400).json({
      message: error
        ? error.message
        : idError
        ? idError.message
        : "",
    });
  let updatedMessage = await Message.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedMessage);
});

module.exports = router;
