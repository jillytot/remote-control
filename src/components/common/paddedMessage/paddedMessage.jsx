import React from "react";
import "./paddedMessage.scss";

const PaddedMessage = ({ children }) => {
  return <div className="paddedMessage__message">{children}</div>;
};

export default PaddedMessage;
