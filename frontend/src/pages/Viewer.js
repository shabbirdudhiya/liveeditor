import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const Viewer = ({ languageCode }) => {
  const [liveEntry, setLiveEntry] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish the socket connection
    const socket = io("http://localhost:9000"); // server URL
    // Set the socket instance to state
    setSocket(socket);

    // Fetch the initial live entry on component mount
    const fetchLiveEntry = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/live");
        if (response.status === 200) {
          const entry = response.data;
          if (entry && entry.isLive) {
            setLiveEntry(entry);
          } else {
            setLiveEntry("No Results Found.");
          }
          console.log(entry);
        } else {
          console.error("Failed to fetch live entry.");
        }
      } catch (error) {
        console.error("Error fetching live entry:", error);
      }
    };

    fetchLiveEntry();

    // Clean up the socket connection when unmounting
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("updateUploadStatus", async () => {
      try {
        const response = await axios.get("/api/live-entry");
        if (response.status === 200) {
          const entry = response.data;
          if (entry && entry.isLive) {
            setLiveEntry(entry);
          } else {
            setLiveEntry("No Results Found.");
          }
        } else {
          console.error("Failed to fetch live entry.");
        }
      } catch (error) {
        console.error("Error fetching live entry:", error);
      }
    });
  }, [socket]);

  return (
    <div className="viewer-page">
      {liveEntry && languageCode in liveEntry.translatedTexts ? (
        <div
          className="live-entry"
          style={{
            fontSize: `min(10vw, 10vh)`,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "black",
            color: "white",
            padding: "2rem",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          {liveEntry.translatedTexts[languageCode]}
        </div>
      ) : (
        <p>No live entry available in the selected language.</p>
      )}
    </div>
  );
};

export default Viewer;
