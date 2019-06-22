import React, { Component } from "react";
import "../../../../styles/common.css";
import Input from "../../../common/input";
import Toggle from "../../../common/toggle";
import { deleteRobot } from "../../../../config/clientSettings";

import axios from "axios";

export default class RobotSettings extends Component {
  state = { settings: {}, toggleTest: false };

  handleDelete = async e => {
    console.log(this.props);
    const token = localStorage.getItem("token");
    e.preventDefault();

    await axios
      .post(
        deleteRobot,
        {
          robot_id: this.props.robot.id,
          host_id: this.props.robot.host_id,
          owner_id: this.props.robot.owner_id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .catch(err => {
        console.log("Could Not Delete Robot", err);
      });

    //Do Axios Stuff
    console.log(e, "delete");
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
        onClick={e => this.handleDelete(e)}
      >
        {label}
      </button>
    );
  };

  handleToggle = () => {
    let toggle = !this.state.toggleTest;

    this.setState({ toggleTest: toggle });
  };

  render() {
    return (
      <div className="register-form spacer">
        Settings for robot: {this.props.robot.name}
        <div> </div>
        <div className="toggle-group">
          <Input name={"API Key: "} label={"API Key: "} type={"form"} />
          <Toggle
            toggle={this.state.toggleTest}
            label={"Show API Key"}
            onClick={this.handleToggle}
          />
        </div>
        {this.renderButton("Delete Robot")}
      </div>
    );
  }
}
