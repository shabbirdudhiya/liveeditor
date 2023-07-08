import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import ModeratorCard from "../components/ModeratorCard";

const Moderator = () => {
  const [messages, setMessages] = useState([]);
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
    // Add event listener for "textUploaded" events
    if (!socket) return;

    socket.on("initialEntries", (entries) => {
      // console.log("Received initialEntries:", entries);
      setMessages(entries);
    });

    socket.on("textUploaded", (data) => {
      // console.log("Received textUploaded event:", data);
      // Update the messages state with the new data
      setMessages((messages) => [...messages, data]);
    });

    // Clean up the event listener when unmounting
    return () => {
      socket.off("textUploaded");
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
          setMessages={setMessages}
        />
        <ModeratorCard
          editorId={2}
          messages={filteredMessages(2)}
          socket={socket}
          setMessages={setMessages}
        />
        <ModeratorCard
          editorId={3}
          messages={filteredMessages(3)}
          socket={socket}
          setMessages={setMessages}
        />
      </div>
    </>
  );
};

export default Moderator;
