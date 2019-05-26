import React, { Component } from "react";
import "./robot.css";

export default class Robot extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="robot-container">
          <div className="robot-display-container" />
          <div className="robot-controls-container">
            {/* <button className="btn"> f : forward</button>{" "}
            <button className="btn"> r : right</button>{" "}
            <button className="btn"> l : left</button>{" "}
            <button className="btn"> b : back</button>{" "} */}
            ...
          </div>
        </div>
      </React.Fragment>
    );
  }
}
