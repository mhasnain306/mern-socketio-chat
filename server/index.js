const express = require("express");
const db = require("./db");
const app = express();
const server = require("http").createServer(app);
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const messageRouter = require("./routes/messages");
const groupRouter = require("./routes/groups");
const {
  saveEvent,
  getEvents,
  deleteEvents,
} = require("./controller/event.controller");
const cors = require("cors");
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
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);

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

  socket.on("register", async (dbId) => {
    console.log("User registered: ", socket.id);
    console.log("User Id", dbId);
    socket.dbId = dbId;
    users[dbId] = socket.id;
    io.emit("userConnected", { userId: socket.dbId });
    console.log("total users map: ", users);
    const events = await getEvents("chat", socket.dbId);
    if (events.length > 0) {
      console.log("Events: ", events);
      const eventsPromises = events.map((e) => {
        return new Promise((resolve) => {
          socket.emit("chat", e.payload, (response) => {
            console.log(
              "The received message object: ",
              response
            );
            resolve(response);
          });
        });
      });

      const updatedMessages = await Promise.all(eventsPromises);
      console.log("Pushed messages: ", updatedMessages);
      if (updatedMessages.length > 0 && updatedMessages[0]) {
        const senderId = updatedMessages[0].from;
        socket
          .timeout(1000)
          .to(users[senderId])
          .emit("MessagesSentLater", updatedMessages);
        const eventsCount = await deleteEvents(
          "chat",
          socket.dbId
        );
        console.log("Total deleted Events: ", eventsCount);
      }
    }
  });

  socket.on("isUserOnline", (dbId) => {
    if (users[dbId]) {
      socket.emit("isUserOnline", true);
    } else socket.emit("isUserOnline", false);
  });

  socket.on("userLoggedOut", (dbId) => {
    io.emit("userDisconnected", {
      userId: socket.dbId,
    });
    delete users[socket.dbId];
  });

  socket.on("chat", async (message, callback) => {
    console.log(users[message.to]);
    if (!users[message.to]) {
      const newEvent = {
        name: "chat",
        payload: message,
      };
      await saveEvent(newEvent);
      callback(null);
      return;
    }
    socket
      .timeout(1000) // Set a 1-second timeout for the ack
      .to(users[message.to])
      .emit("chat", message, (err, response) => {
        if (err) {
          console.log("The message couldn't deliver", err);
          return;
        }
        console.log("The received message object: ", response);
        callback(response[0]);
      });
  });

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log("User joined the group");
  });

  socket.on("groupChat", (message, groupId) => {
    io.to(groupId).emit("groupChat", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    io.emit("userDisconnected", {
      userId: socket.dbId,
    });
    delete users[socket.dbId];
  });
});

db.connect();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log("Listening on port " + PORT)
);
