import "./css/Editor.css";

import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import React, { useState } from "react";

import io from "socket.io-client";

const Editor = ({ editorId }) => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const socket = io("http://localhost:9000");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpload();
    }
  };

  const handleUpload = () => {
    if (text.trim() === "") {
      return;
    }

    setIsUploading(true);
    setIsDisabled(true);

    setTimeout(() => {
      socket.emit("textUpload", { editorId: editorId, text: text });
      setIsUploading(false);
      setText("");
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <>
      <h3 className="text-center my-2">Editor: {editorId}</h3>
      <div className="chat-editor">
        <div className="chat-container">
          <div className="chat-input-wrapper">
            <textarea
              className="form-control chat-input"
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
              disabled={isDisabled}
              placeholder="Type your Sentence..."
              autoFocus="true"
            />
            <button
              className="btn btn-primary chat-button"
              disabled={isDisabled}
              onClick={handleUpload}
            >
              {isUploading ? <FaSpinner /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
