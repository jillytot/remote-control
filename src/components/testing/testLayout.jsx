import React, { Component } from "react";
import "./test.css";

export default class TestLayout extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="nav-bar"> It's a Nav! </div>
          <div className="left">
            <div className="left-container">
              <div className="server-container">
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
                <div className="server-option">Server</div>
              </div>

              <div className="channel-container" />
            </div>
          </div>
          <div className="center">
            <p>Here is stuff i want to write. This is stuff. It is great.</p>
          </div>
          <div className="right">Right Side</div>
          <div className="footer">Footer</div>
        </div>
      </React.Fragment>
    );
  }
}
