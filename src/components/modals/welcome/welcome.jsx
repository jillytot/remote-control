import React, { Component } from "react";
import "./welcome.scss";

export default class Welcome extends Component {
  state = {};

  render() {
    return (
      <div className="welcome__container">
        <div className="welcome__message">Welcome to Remo!</div>
      </div>
    );
  }
}
