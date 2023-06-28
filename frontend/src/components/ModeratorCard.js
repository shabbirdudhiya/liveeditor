import React, { useEffect, useState } from "react";
import ModeratorCard from "../components/ModeratorCard";
import io from "socket.io-client";

const Moderator = () => {
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:9000"); // Replace with your server URL

  useEffect(() => {
    // Listen for incoming textUploaded events from the server
    socket.on("textUploaded", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("textUploaded");
    };
  }, []);

  const handleUpload = (editorId, text) => {
    socket.emit("textUpload", { editorId, text });
  };

  const handleStatusChange = (entryId) => {
    // Update the status of the entry in the database
    // You can implement this using an API call or any other method to update the entry status

    // For demonstration purposes, let's update the status locally
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message._id === entryId) {
          return {
            ...message,
            uploadStatus: "Uploaded",
          };
        }
        return message;
      })
    );
  };

  return (
    <>
      <h3 className="text-center">Moderator Dashboard</h3>
      <div className="container-fluid row my-2">
        <ModeratorCard
          editorId={1}
          messages={messages.filter(
            (message) =>
              message.editorId === 1 && message.uploadStatus === "Not Uploaded"
          )}
          handleUpload={handleUpload}
          handleStatusChange={handleStatusChange}
        />
        <ModeratorCard
          editorId={2}
          messages={messages.filter(
            (message) =>
              message.editorId === 2 && message.uploadStatus === "Not Uploaded"
          )}
          handleUpload={handleUpload}
          handleStatusChange={handleStatusChange}
        />
        <ModeratorCard
          editorId={3}
          messages={messages.filter(
            (message) =>
              message.editorId === 3 && message.uploadStatus === "Not Uploaded"
          )}
          handleUpload={handleUpload}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </>
  );
};

export default Moderator;
