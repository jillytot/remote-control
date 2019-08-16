import React, { Component } from "react";
import "../../../../styles/common.css";
import Input from "../../../common/input";
import Toggle from "../../../common/toggle";
import { deleteRobot, robotAPIKey } from "../../../../config/clientSettings";

import axios from "axios";

export default class RobotSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      apiToggle: false,
      apiKey: "",
      isConfirmingDelete: false
    };
    this.inputRef = null;

    this.setInputRef = element => {
      this.inputRef = element;
    };

    this.handleCopy = () => {
      if (this.inputRef) {
        this.inputRef.select();
        document.execCommand("copy");
      }
    };
  }

  componentDidMount() {
    this.handleGetAPIKey();
  }

  handleGetAPIKey = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        robotAPIKey,
        {
          robot_id: this.props.robot.id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        this.setState({ apiKey: res.data.key });
      })
      .catch(err => {
        console.log("Problem Fetching Key", err);
      });
  };

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

  renderButton = (label, onClick) => {
    //require validation?
    return (
      <button className={this.handleButtonType(label)} onClick={onClick}>
        {label}
      </button>
    );
  };

  handleToggle = () => {
    let toggle = !this.state.apiToggle;
    this.setState({ apiToggle: toggle });
  };

  renderDeleteConfirmation = () => {
    return (
      <div>
        <h3>Are you sure you want to delete '{this.props.robot.name}'?</h3>
        <span>Deleted things can't be brought back.</span>
        <div>
          {this.renderButton("Delete Robot", this.handleDelete)}
          {this.renderButton("Cancel", () =>
            this.setState({ isConfirmingDelete: false })
          )}
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="register-form spacer">
        Settings for robot: {this.props.robot.name}
        <div> </div>
        <div className="toggle-group">
          <Input
            name={"API Key: "}
            label={"API Key: "}
            type={this.state.apiToggle ? "form" : "password"}
            value={this.state.apiKey}
            readOnly
            ref={this.setInputRef}
          />
          <div className="toggle-clipboard-group">
            {this.state.apiToggle ? (
              <div className="copy-to-clipboard" onClick={this.handleCopy}>
                copy to clipboard
              </div>
            ) : null}
            <Toggle
              toggle={this.state.apiToggle}
              label={"Show API Key"}
              onClick={this.handleToggle}
            />
          </div>
        </div>
        {!this.state.isConfirmingDelete
          ? this.renderButton("Delete Robot", () =>
              this.setState({ isConfirmingDelete: true })
            )
          : this.renderDeleteConfirmation()}
      </div>
    );
  }
}
