const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  editorId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    default: Date.now,
  },
  uploadStatus: {
    type: String,
    default: "Not Uploaded",
  },
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
