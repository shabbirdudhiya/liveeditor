const socketIO = require("socket.io");
const mongoose = require("mongoose");
const Entry = require("./models/Entry");

const PORT = process.env.PORT || 9000;

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/entries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Socket.io Connection
const io = require("socket.io")(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("textUpload", ({ editorId, text }) => {
    console.log(`Editor ${editorId} uploaded text: ${text}`);

    // Create a new entry in the database
    const newEntry = new Entry({
      editorId,
      text,
      uploadStatus: "Not Uploaded",
    });

    newEntry.save((err) => {
      if (err) {
        console.error("Failed to save entry:", err);
        return;
      }
      console.log("Entry saved successfully");

      // Broadcast the uploaded text to all connected clients
      io.emit("textUploaded", {
        editorId,
        text,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// const PORT = process.env.PORT || 9000;

// const io = require("socket.io")(PORT, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("textUpload", ({ editorId, text }) => {
//     console.log(`Editor ${editorId} uploaded text: ${text}`);

//     // Broadcast the uploaded text to all connected clients
//     io.emit("textUploaded", { editorId, text });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });
