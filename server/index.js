const express = require("express");
const db = require("./db");
const app = express();
const server = require("http").createServer(app);
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cors = require("cors");
const { Interface } = require("readline");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    exposedHeaders: ["x-auth-token"],
  })
);
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

let users = {};
io.on("connection", (socket) => {
  console.log("A New user: ", socket.id);

  // socket.emit("connect", socket.id);

  socket.on("chat message", (message, channel) => {
    const newMessage = `${socket.id}: ${message}`;
    if (channel === "") {
      io.emit("chat message", newMessage);
    } else {
      socket.to(channel).emit("chat message", newMessage);
    }
  });

  socket.on("join-channel", (channel, cb) => {
    socket.join(channel);
    cb(`Joined channel: ${channel}`);
  });

  socket.on("register", (userId) => {
    console.log("User registered: ", socket.id);
    console.log("User Id", userId);
    users[userId] = socket.id;
    console.log("total users map: ", users);
  });

  socket.on("chat", (message) => {
    console.log("The uesr id in chat: ", message.to);
    console.log(users[message.to]);
    console.log(users);
    socket.to(users[message.to]).emit("chat", message);
    console.log("Message after the chat emit");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

db.connect();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log("Listening on port " + PORT)
);
