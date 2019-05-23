import React from "react";
import "./user.css";
import "./../../../styles/common.css";
import { LOGOUT } from "../../../services/sockets/events";
import defaultImages from "../../../imgs/placeholders";

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
    window.location.href = "/";
  };

  return (
    <div>
      <div className="user">
        <img className="logo" alt="" src={defaultImages.remoLogo} />
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
