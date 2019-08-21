import React from "react";
import "../../styles/common.css";

const toggle = ({ toggle, label, onClick, critical }) => {
  const toggleOn = () => {
    return (
      <div className={handleType()}>
        <div className="toggle-pip-on" />
      </div>
    );
  };

  const handleType = () => {
    if (critical) return "toggle-on critical";
    return "toggle-on";
  };

  const toggleOff = () => {
    return (
      <div className="toggle-off">
        <div className="toggle-pip-off" />
      </div>
    );
  };

  return (
    <div className="form-group">
      <div className="toggle-container">
        <div className="toggle-label">{label}</div>
        <div onClick={toggle => onClick(!toggle)}>
          {toggle ? toggleOn() : toggleOff()}
        </div>
      </div>
    </div>
  );
};

export default toggle;
