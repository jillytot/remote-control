import React from "react";
import "./user.css";

const User = ({ user, onClick }) => {
  const displayName = user["name"];

  return (
    <div>
      <div className="user">{displayName}</div>
      <button
        className="user-logout"
        onClick={() => {
          onClick(user);
        }}
      >
        logout
      </button>
    </div>
  );
};

export default User;
