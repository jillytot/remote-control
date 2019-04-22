import React from "react";
import "./user.css";

const User = ({ user, onLogout }) => {
  const displayName = user["name"];
  console.log("This User: ", user);

  return (
    <div>
      <div className="user">{displayName}</div>
      <button className="user-logout" onClick={onLogout}>
        logout
      </button>
    </div>
  );
};

export default User;
