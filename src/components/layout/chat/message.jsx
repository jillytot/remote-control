import React from "react";
import Emotes from "../../../emotes/emotes";
import defaultImages from "../../../imgs/placeholders";

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
    let filter = [];

    filterMessage.split(" ").forEach((word, i) => {
      if (Emotes.hasOwnProperty(word)) {
        filter.push(
          <span key={`${word}${i}`}>
            <img className="emote" src={Emotes[word]} alt={word} />{" "}
          </span>
        );
      } else {
        filter.push(word + " ");
      }
    });
    return filter;
  };

  const handleBadges = badges => {
    console.log(badges);
    if (badges && badges.length > 0) {
      return badges.map(badge => {
        if (badge === "staff") {
          console.log("ADD BADGE!");
          return (
            <span key={badge} className="badge-container">
              Badge
              <img
                className="badge"
                src={defaultImages["remoStaffBadge"]}
                alt={badge}
              />
            </span>
          );
        } else {
          return <React.Fragment />;
        }
      });
    }
  };

  return (
    <div>
      <div
        className={`chat-message ${color} ${
          message.type === types.self ? types.self : ""
        }`}
      >
        {handleBadges(message.badges)}
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
