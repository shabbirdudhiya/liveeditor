require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { TranslationServiceClient } = require("@google-cloud/translate");

const socketIO = require("socket.io");
const Entry = require("./models/Entry");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 9000;

const targetLanguages = ["en", "fr", "id"]; // for translation

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/liveeditor", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Express App
const app = express();

// Enable CORS
app.use(cors());

// Socket.io Setup
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // the URL of  frontend application
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // Add any additional headers require
  },
});

io.on("connection", async (socket) => {
  console.log("A user connected");

  // Fetch all entries from the database and send them to the connected client
  try {
    const entries = await Entry.find().exec();
    socket.emit("initialEntries", entries);
  } catch (err) {
    console.error("Failed to fetch entries:", err);
  }

  socket.on("textUpload", async ({ editorId, text }) => {
    console.log(`Editor ${editorId} uploaded text: ${text}`);
    // Create a new entry in the database
    const newEntry = new Entry({ editorId, text });

    try {
      const savedEntry = await newEntry.save();
      console.log("Entry saved successfully");

      // Broadcast the uploaded text to all connected clients
      io.emit("textUploaded", savedEntry);
    } catch (err) {
      console.error("Failed to save entry:", err);
    }
  });

  // Change Entry Status

  socket.on("updateUploadStatus", async ({ entryId, uploadStatus, isLive }) => {
    try {
      // Find the entry in the database based on the provided entryId
      const entry = await Entry.findById(entryId).exec();

      if (!entry) {
        console.log(`Entry not found with ID: ${entryId}`);
        return;
      }

      // Perform translation
      const translationMap = await translateInMultipleLanguages(
        entry.text,
        targetLanguages
      );

      // Check if the translation was successful
      const isTranslationSuccessful = Object.keys(translationMap).length > 0;
      // const isTranslationSuccessful = Object.values(translationMap).some(
      //   (value) => value && value.trim() !== ""
      // );

      if (isTranslationSuccessful) {
        // Update the upload status of the entry
        entry.uploadStatus = uploadStatus;
        entry.isLive = isLive;

        // Save the translated texts in the entry
        entry.translatedTexts = translationMap;

        // Update the upload status of the entry
        entry.uploadStatus = uploadStatus;
        entry.isLive = isLive;

        // Save the entry
        await entry.save();

        // Update the isLive status of all other entries to false
        await Entry.updateMany(
          { _id: { $ne: entryId } },
          { $set: { isLive: false } }
        );

        io.emit("uploadStatusUpdated", {
          entryId,
          uploadStatus,
          isLive,
          success: true,
        });
        console.log(`UploadStatus and isLive updated for entry ID: ${entryId}`);
      } else {
        console.log("Translation failed");
        return;
      }
    } catch (err) {
      console.error("Failed to update uploadStatus & isLive:", err);

      // Emit the uploadStatusUpdated event with an error response
      socket.emit("uploadStatusUpdated", {
        success: false,
        error: err.message,
      });
    }
  });

  // socket disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// TRANSLATION API ---------------------

// Instantiates a client
const translationClient = new TranslationServiceClient();
const projectId = "prefab-clover-391412";
const location = "global";

async function translateSentence(sentence, targetLanguage) {
  try {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [sentence],
      mimeType: "text/plain",
      sourceLanguageCode: "en",
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);

    const translatedText = response.translations[0].translatedText;

    // console.log(`Translation (${targetLanguage}): ${translatedText}`);
    // for (const translation of response.translations) {
    //   console.log(
    //     `Translation (${targetLanguage}): ${translation.translatedText}`
    //   );
    // }
    return translatedText;
  } catch (error) {
    console.error(`Translation (${targetLanguage}) failed: ${error}`);
    return "";
  }
}

async function translateInMultipleLanguages(sentence, targetLanguages) {
  const translationPromises = targetLanguages.map(async (targetLanguage) => {
    if (targetLanguage === "en") {
      // If the target language is English, use the input sentence as the translation
      return sentence;
    } else {
      // Perform translation for non-English target languages
      const translatedText = await translateSentence(sentence, targetLanguage);
      return translatedText;
    }
  });
  const translations = await Promise.all(translationPromises);

  const translationMap = targetLanguages.reduce((map, language, index) => {
    map[language] = translations[index];
    return map;
  }, {});

  return translationMap;
}

// Routes

// TODO: uncomment the date line to get today's entries only
app.get("/api/live", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const liveEntry = await Entry.findOne({
      isLive: true,
      // "datetime.$date": { $gte: new Date(currentDate) },
    }).exec();

    if (liveEntry) {
      res.json(liveEntry);
    } else {
      res.status(404).json({ error: "No live entry found." });
    }
  } catch (error) {
    console.error("Error fetching live entry:", error);
    res.status(500).json({ error: "Failed to fetch live entry." });
  }
});

// Mount the router
// app.use(router);
