import React from "react";

const Message = ({ message }) => {
  console.log("message: ", message);
  return (
    <div>
      <div className="chat-message">
        <span className="chat-user-name">{`${message.username}:  `}</span>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default Message;
