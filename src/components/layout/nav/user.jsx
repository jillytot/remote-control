import React from "react";
import "./user.css";
import "./../../../styles/common.css";
import { LOGOUT } from "../../../services/sockets/events";

const User = ({ user, socket }) => {
  const displayName = user["username"];

  const handleClick = user => {
    console.log("Handle Logout: ", user);
    user !== null
      ? socket.emit(LOGOUT, user, () => {
          console.log("Logging Out");
        })
      : console.log("User Logout Error");
    console.log("Clearing token from local storage");
    localStorage.removeItem("token");
  };

  return (
    <div className="header">
      <div className="user">
        {displayName}{" "}
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
