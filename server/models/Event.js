const mongoose = require("mongoose");
const { messageSchema } = require("./Message");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: messageSchema,
    required: true,
  },
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = EventModel;
