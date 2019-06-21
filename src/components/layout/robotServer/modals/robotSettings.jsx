import React, { Component } from "react";
import Form from "../../../common/form";
import "../../../../styles/common.css";
import Input from "../../../common/input";

import axios from "axios";

export default class RobotSettings extends Component {
  state = { settings: {} };

  handleSubmit = async e => {
    e.preventDefault();

    console.log("delete");
    this.props.onCloseModal();
  };

  handleButtonType = label => {
    if (label === "Delete Robot") {
      console.log(label);
      return "btn btn-delete";
    } else {
      return "btn";
    }
  };

  renderButton = label => {
    //require validation?
    return (
      <button
        className={this.handleButtonType(label)}
        onClick={e => this.handleSubmit(e)}
      >
        {label}
      </button>
    );
  };

  render() {
    return (
      <div className="register-form spacer">
        Settings for robot: {this.props.robot.name}
        <div> </div>
        <Input name={"API Key: "} label={"API Key: "} type={"form"} />
        {this.renderButton("Delete Robot")}
      </div>
    );
  }
}
