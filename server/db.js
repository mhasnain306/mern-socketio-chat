const mongoose = require("mongoose");

const connect = () => {
  console.log(process.env.chat_MONGO_URI);

  mongoose
    .connect(process.env.chat_MONGO_URI)
    .then(() => console.log("Connected to chat successfully"))
    .catch((err) => console.log("There was an error: ", err));
};

module.exports.connect = connect;
