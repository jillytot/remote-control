import React from "react";
import "./chat.css";

const UserList = ({ users }) => {
  const colors = [
    "blue",
    "cyan",
    "green",
    "yellow",
    "orange",
    "pink",
    "pruple"
  ];

  let color = colors => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //console.log("Users from UserList", users);
  return (
    <div className="user-list-container">
      <div className="ulist">
        {Object.keys(users).map(user => {
          let { name, id } = users[user];
          return (
            <div className={`user-list ${color(colors)}`} key={id}>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
