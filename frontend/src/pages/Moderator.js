import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import ModeratorCard from "../components/ModeratorCard";

const Moderator = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchUpdatedEntries = async () => {
    try {
      // Fetch the updated entries from the server
      const response = await fetch("/api/entries");
      const data = await response.json();
      return data.entries;
    } catch (err) {
      throw new Error("Failed to fetch updated entries: " + err.message);
    }
  };

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
    // Add event listener for "textUploaded" events
    if (!socket) return;

    socket.on("initialEntries", (entries) => {
      console.log("Received initialEntries:", entries);
      setMessages(entries);
    });

    socket.on("textUploaded", (data) => {
      console.log("Received textUploaded event:", data);

      // Update the messages state with the new data
      setMessages((messages) => [...messages, data]);
    });

    // Clean up the event listener when unmounting
    return () => {
      socket.off("textUploaded");
    };
  }, [socket]);

  useEffect(() => {
    // Add event listener for "updateUploadStatus" event
    if (!socket) return;
    socket.on("updateUploadStatus", async (data) => {
      console.log("Received updateUploadStatus event:", data);

      // Fetch the updated entries from the database
      try {
        const updatedEntries = await fetchUpdatedEntries(); // function to fetch the updated entries from the database

        // Update the messages state with the updated data
        setMessages((messages) =>
          messages.map((message) => {
            const updatedEntry = updatedEntries.find(
              (entry) => entry._id === message._id
            );
            if (updatedEntry) {
              return {
                ...message,
                uploadStatus: updatedEntry.uploadStatus,
                isLive: updatedEntry.isLive,
              };
            } else {
              return message;
            }
          })
        );
      } catch (err) {
        console.error("Failed to fetch updated entries:", err);
      }
    });

    // Clean up the event listener when unmounting
    return () => {
      socket.off("updateUploadStatus");
    };
  }, [socket]);

  const filteredMessages = (editorId) => {
    // Filter messages by editorId
    return messages.filter((message) => message.editorId === editorId);
  };

  return (
    <>
      <h3 className="text-center">Moderator Dashboard</h3>
      <div className="container-fluid row my-2">
        <ModeratorCard
          editorId={1}
          messages={filteredMessages(1)}
          socket={socket}
          setMessag={setMessages}
        />
        <ModeratorCard
          editorId={2}
          messages={filteredMessages(2)}
          socket={socket}
          setMessag={setMessages}
        />
        <ModeratorCard
          editorId={3}
          messages={filteredMessages(3)}
          socket={socket}
          setMessag={setMessages}
        />
      </div>
    </>
  );
};

export default Moderator;
