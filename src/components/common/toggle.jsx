import React from "react";
import "../../styles/common.css";

const toggle = ({ toggle, label, onClick }) => {
  return (
    <div className="toggle-container">
      <div className="toggle-label">{label}</div>
      <div className="toggle-state" onClick={toggle => onClick(!toggle)}>
        {toggle ? "toggle on" : "toggle off"}{" "}
      </div>
    </div>
  );
};

export default toggle;
