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
    <div className="w-full sm:w-1/2 lg:w-1/2 px-2 my-2">
      <div className="flex flex-col h-[280px] bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <img
            src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-3/3/49-512.png"
            alt="Editor Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <h2 className="text-xl font-bold">Editor {editorId}</h2>
            <p className="text-sm text-gray-500">
              Subtitle or additional information
            </p>
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {messages.length === 0 ? (
            <p>No results found</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {messages.map((message) => (
                <li className="py-2" key={message._id}>
                  {/* Message content */}
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
