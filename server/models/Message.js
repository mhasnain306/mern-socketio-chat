const mongoose = require("mongoose");

messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 2,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
  delivered: {
    type: String,
    enum: ["server", "recipient"],
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
module.exports.messageSchema = messageSchema;
