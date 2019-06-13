import React from "react";
import "./overlay.css";

/*
  Modal is rendered in layout.jsx
  The component that calls model can just simple send and object containing the content
  the content object can then be parsed out here
  */

const modal = ({ show, close, contents }) => {
  const displayContent = getContent => {
    return contents.map((content, key) => {
      return <div key={key}>{content[getContent]}</div>;
    });
  };

  return (
    <div className="modal-outer">
      <div
        className="modal-wrapper"
        style={{
          opacity: show ? "1" : "0"
        }}
      >
        <div className="modal-header">
          <h3>{displayContent("header")}</h3>
          <span className="close-modal-btn" onClick={close}>
            ×
          </span>
        </div>
        <div className="modal-body">{displayContent("body")}</div>
        <div className="modal-footer">
          <button className="btn-continue btn">ok.</button>
        </div>
      </div>
    </div>
  );
};

export default modal;
