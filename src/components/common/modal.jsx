import React, { Component } from "react";
import "./overlay.css";

/*
  Modal is rendered in layout.jsx
  The component that calls model can just simple send and object containing the content
  the content object can then be parsed out here
  */

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  displayContent = getContent => {
    const { contents } = this.props;
    return contents.map((content, key) => {
      return <div key={key}>{content[getContent]}</div>;
    });
  };

  render() {
    const { show, close } = this.props;
    return (
      <div className="modal-outer">
        <div
          className="modal-wrapper"
          style={{
            opacity: show ? "1" : "0"
          }}
        >
          <div className="modal-header">
            <h3>{this.displayContent("header")}</h3>
            <span className="close-modal-btn" onClick={close}>
              ×
            </span>
          </div>
          <div ref="container" className="modal-body modal-scroll">
            {this.displayContent("body")}
          </div>
          <div className="modal-footer">{this.displayContent("footer")}</div>
        </div>
      </div>
    );
  }
}
