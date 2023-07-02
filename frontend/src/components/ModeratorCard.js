import React, { useEffect } from "react";

function ModeratorCard({ editorId, messages, socket, setMessages }) {
  useEffect(() => {
    if (!socket) return;

    // Add event listener for "updateUploadStatus" event
    socket.on("updateUploadStatus", (data) => {
      const { entryId, isLive } = data;

      // Update the messages state with the updated isLive status
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === entryId ? { ...message, isLive } : message
        )
      );
    });

    // Clean up the event listener when unmounting
    return () => {
      socket.off("updateUploadStatus");
    };
  }, [socket]);

  const handleUploadClick = (entryId) => {
    if (socket) {
      // Update the upload status in the database
      socket.emit("updateUploadStatus", {
        entryId,
        uploadStatus: "Uploaded",
        isLive: true,
      });
    }
  };
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString();
  };
  return (
    <div className="col-md-4">
      <div className="card">
        <div className="card-header">
          <h2>Editor {editorId}</h2>
        </div>
        <div className="card-body">
          {messages.length === 0 ? (
            <p>No results found</p>
          ) : (
            <ul className="list-group list-group-flush">
              {messages.map((message) => (
                <li className="list-group-item message" key={message._id}>
                  <small>{formatDateTime(message.datetime)}:</small>{" "}
                  <strong>{message.text}</strong>
                  <button
                    className={`btn btn-sm mx-1 my-1 ${
                      message.uploadStatus === "Uploaded" && message.isLive
                        ? "btn-success"
                        : message.uploadStatus === "Uploaded" && !message.isLive
                        ? "btn-info"
                        : "btn-danger"
                    }`}
                    onClick={() => handleUploadClick(message._id)}
                    disabled={message.uploadStatus === "Uploaded"}
                  >
                    {message.uploadStatus === "Uploaded" && message.isLive
                      ? "Live"
                      : message.uploadStatus === "Uploaded" && !message.isLive
                      ? "Uploaded"
                      : "Upload"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModeratorCard;
