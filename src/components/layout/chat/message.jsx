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

  return (
    <div>
      <div
        className={`chat-message ${color} ${
          message.type === types.self ? types.self : ""
        }`}
      >
        <span className="chat-user-name">{`${message.sender}${
          message.type === types.self ? "" : ":"
        }  `}</span>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default Message;
