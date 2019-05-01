import React from "react";

const Message = ({ message, color }) => {
  const types = {
    default: "",
    admin: "admin",
    channel: "channel",
    special: "special",
    siteCommand: "site-command",
    self: "self"
  };

  const { special } = types;

  return (
    <div>
      <div
        className={`chat-message ${color} ${
          message.type === types.self ? special : ""
        }`}
      >
        <span className="chat-user-name">{`${message.sender}:  `}</span>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default Message;
