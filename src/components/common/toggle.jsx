import React from "react";
import "../../styles/common.css";

const toggle = ({ toggle, label, onClick, critical, inline }) => {
  const toggleOn = () => {
    return (
      <div className={handleType()}>
        <div className="toggle-text">ON</div>
        <div className="toggle-pip" />
      </div>
    );
  };

  const handleType = () => {
    if (critical) return "toggle on critical";
    return "toggle on";
  };

  const toggleOff = () => {
    return (
      <div className="toggle off">
        <div className="toggle-pip translate" />
        <div className="toggle-text">OFF</div>
      </div>
    );
  };

  return (
    <div className={inline ? "" : "form-group"}>
      <div className={inline ? "toggle-container-inline" : "toggle-container"}>
        <div className="toggle-label">{label}</div>
        <div onClick={toggle => onClick(!toggle)}>
          {toggle ? toggleOn() : toggleOff()}
        </div>
      </div>
    </div>
  );
};

export default toggle;
