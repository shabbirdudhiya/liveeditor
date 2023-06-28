const PORT = process.env.PORT || 9000;

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

    // Broadcast the uploaded text to all connected clients
    io.emit("textUploaded", { editorId, text });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
