import React from "react";

const Message = ({ message, color }) => {
  console.log("message: ", message);

  return (
    <div>
      <div className={`chat-message ${color}`}>
        <span className="chat-user-name">{`${message.sender}:  `}</span>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default Message;
