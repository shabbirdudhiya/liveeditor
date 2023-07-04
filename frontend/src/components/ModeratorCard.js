import React, { useEffect } from "react";

function ModeratorCard({ editorId, messages, socket, setMessages }) {
  useEffect(() => {
    if (!socket) return;
    // Listen for the server's response
    socket.on("uploadStatusUpdated", (response) => {
      // Check if the response is successful
      if (response.success) {
        // Update the local state with the updated upload status and isLive values
        setMessages((messages) =>
          messages.map((message) =>
            message._id === response.entryId
              ? { ...message, uploadStatus: "Uploaded", isLive: true }
              : { ...message, isLive: false }
          )
        );
      } else {
        // Handle the error case, such as displaying an error message
        console.error("Failed to update upload status:", response.error);
      }
    });

    // Clean up the event listener when unmounting
    return () => {
      socket.off("uploadStatusUpdated");
    };
  }, [socket, setMessages]);

  const handleUploadClick = (entryId) => {
    if (!socket) return;
    // Update the upload status in the database
    socket.emit("updateUploadStatus", {
      entryId,
      uploadStatus: "Uploaded",
      isLive: true,
    });
  };
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString();
  };

  return (
    <div className="col-md-4 my-1">
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
