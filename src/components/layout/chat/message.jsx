import React from "react";
import Emotes from "../../../emotes/emotes";

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
        <span>
          {message.message}
          <img className="emote" src={Emotes.robot} alt="" />
        </span>
      </div>
    </div>
  );
};

export default Message;
