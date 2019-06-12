import React from "react";
import "./overlay.css";

const modal = ({ show, close, content }) => {
  console.log(content);
  return (
    <div className="modal-outer">
      <div
        className="modal-wrapper"
        style={{
          opacity: show ? "1" : "0"
        }}
      >
        <div className="modal-header">
          <h3>Modal Header</h3>
          <span className="close-modal-btn" onClick={close}>
            ×
          </span>
        </div>
        <div className="modal-body">
          <p>{content}</p>
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
