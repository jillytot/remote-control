import React from "react";
import "./overlay.css";

/*
  Modal is rendered in layout.jsx
  The component that calls model can just simple send and object containing the content
  the content object can then be parsed out here
  */

const modal = ({ show, close, contents }) => {
  const getContent = getContent => {
    return contents.forEach(content => {
      console.log("GET CONTENT: ", getContent, content);
      if (getContent == Object.keys(content)) {
        console.log(content[getContent]);
        return content[getContent];
      }
    });
  };

  console.log(contents);
  return (
    <div className="modal-outer">
      <div
        className="modal-wrapper"
        style={{
          opacity: show ? "1" : "0"
        }}
      >
        <div className="modal-header">
          <h3>{getContent("header")}</h3>
          <span className="close-modal-btn" onClick={close}>
            ×
          </span>
        </div>
        <div className="modal-body">
          <p>{getContent("body")}</p>
        </div>
        <div className="modal-footer">
          {/* <button className="btn-cancel" onClick={close}>
            CLOSE
          </button> */}
          <button className="btn-continue btn">ok.</button>
        </div>
      </div>
    </div>
  );
};

export default modal;
