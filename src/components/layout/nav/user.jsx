import React from "react";
import "./user.css";
import "./../../../styles/common.css";

const User = ({ user, onClick }) => {
  const displayName = user["name"];

  return (
    <div>
      <div className="user">
        {displayName}
        <button
          className="user-logout btn"
          onClick={() => {
            onClick(user);
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default User;
