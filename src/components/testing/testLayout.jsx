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
            <ul className="item">
              <li className="sub-item">Your Face!</li>
              <li className="sub-item">another thing</li>
              <li className="sub-item">that one thing</li>
              <li className="sub-item">something else</li>
              <li className="sub-item">yea....</li>
            </ul>
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
