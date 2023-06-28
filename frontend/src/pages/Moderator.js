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
  // Filter messages by editorId
  const filteredMessages = (editorId) => {
    return messages.filter((message) => message.editorId === editorId);
  };

  return (
    <>
      <h3 className="text-center">Moderator Dashboard</h3>
      <div className="container-fluid row my-2">
        <ModeratorCard
          editorId={1}
          messages={filteredMessages(1)}
          handleUpload={handleUpload}
        />
        <ModeratorCard
          editorId={2}
          messages={filteredMessages(2)}
          handleUpload={handleUpload}
        />
        <ModeratorCard
          editorId={3}
          messages={filteredMessages(3)}
          handleUpload={handleUpload}
        />
      </div>
    </>
  );
};

export default Moderator;
