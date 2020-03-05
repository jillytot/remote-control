import React from "react";
import "./inlineItem.scss";

const InlineItem = ({ label, item }) => {
  return (
    <div className="inlineItem__container">
      <div className="inlineItem__label">{label || "Label: "} </div>
      <div className="inlineItem__value"> {item || "Item"}</div>
    </div>
  );
};

export default InlineItem;
