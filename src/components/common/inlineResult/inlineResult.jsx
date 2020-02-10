import React from "react";
import "./inlineResult.scss";
/**
 * Inputs:
 *    message: ( string ) any
 *    type: ( string ) "error" - default, "success"
 *    onClose: ( function ) optional, handled by parent component
 */
const InlineResponse = ({ message, type, onClose }) => {
  const displayType = type || "error";
  return (
    <div className={`inlineResult__${displayType}-container`}>
      <div className="inlineResult__message"> {message}</div>
      {onClose ? (
        <button className="inlineResult__dismiss" onClick={() => onClose()}>
          dismiss
        </button>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default InlineResponse;
