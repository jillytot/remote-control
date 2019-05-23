import React, { Component } from "react";
import "./overlay.css";

export default class Overlay extends Component {
  state = { load: {} };

  render() {
    return (
      <React.Fragment>
        <div className="overlay">overlay</div>
      </React.Fragment>
    );
  }
}
