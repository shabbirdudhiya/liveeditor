import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Viewer = ({ languageCode }) => {
  const [liveEntry, setLiveEntry] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish the socket connection
    const socket = io("http://localhost:9000"); // Replace with your server URL
    // Set the socket instance to state
    setSocket(socket);
    // Clean up the socket connection when unmounting
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("updateUploadStatus", async (response) => {
      try {
        if (response.success) {
          setLiveEntry(response.translatedTexts["fr"]);
        } else {
          // Handle the error case, such as displaying an error message
          console.error("Failed to update upload status:", response.error);
        }
      } catch (error) {}
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, setLiveEntry]);

  useEffect(() => {
    const socket = io("http://localhost:9000");

    socket.on("updateUploadStatus", async () => {
      try {
        const response = await fetch("/api/live-entry");
        if (response.ok) {
          const entry = await response.json();
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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="viewer-page"
      style={{ backgroundColor: "black", color: "white" }}
    >
      <h1>Viewer Page</h1>
      {liveEntry && languageCode in liveEntry.translatedTexts ? (
        <div
          className="live-entry"
          style={{
            fontSize:
              liveEntry.translatedTexts[languageCode].length > 50
                ? "24px"
                : "32px",
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
