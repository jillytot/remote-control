import React from "react";
import "./user.css";
import "./../../../styles/common.css";
import { LOGOUT } from "../../../services/sockets/events";

const User = ({ user, socket }) => {
  const displayName = user["name"];

  const handleClick = user => {
    console.log("Handle Logout: ", user);
    user !== null
      ? socket.emit(LOGOUT, user, () => {
          console.log("Logging Out");
        })
      : console.log("User Logout Error");
  };

  return (
    <div>
      <div className="user">
        {displayName}
        <button
          className="user-logout btn"
          onClick={() => {
            handleClick(user);
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default User;
