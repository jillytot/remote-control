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

  const handleEmotes = filterMessage => {
    //break message into substrings
    //search each word in message array to match an emote code
    let filter = [];
    filterMessage.split(" ").forEach((word, i) => {
      console.log("word", i, word);
      Object.keys(Emotes).forEach(emote => {
        if (word === emote) {
          filter.push(
            <span key={`${emote}${i}`}>
              <img className="emote" src={Emotes[emote]} alt={word} />{" "}
            </span>
          );
        } else {
          //filter[i] = <React.Fragment>{word}</React.Fragment>;
          filter.push(word + " ");
        }
      });
    });

    // <React.Fragment>Normal text {emote} normal text.</React.Fragment>
    console.log("Filter: ", filter);
    return filter;
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
          {handleEmotes(message.message).map(element => {
            return element;
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;
