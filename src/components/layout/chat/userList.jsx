import React from "react";
import "./chat.css";

const UserList = ({ users }) => {
  //TODO: Make user colors perminent for the duration the user is in the chatroom

  console.log("Users from UserList", users);
  return (
    <div className="user-list-container">
      <div className="ulist">
        {Object.keys(users).map(user => {
          let { username, id, color } = users[user];
          return (
            <div className={`user-list ${color}`} key={id}>
              {username}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
