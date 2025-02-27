const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/chat")
    .then(() => console.log("Connected to chat successfully"))
    .catch((err) => console.log("There was an error: ", err));
};

module.exports.connect = connect;
