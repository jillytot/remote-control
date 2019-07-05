import React, { Component } from "react";
import "../../../../styles/common.css";
import Input from "../../../common/input";
import Toggle from "../../../common/toggle";
import { deleteRobot, robotAPIKey } from "../../../../config/clientSettings";

import axios from "axios";

export default class RobotSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, apiToggle: false, apiKey: "" };
    this.inputRef = React.createRef();
    // this.handleCopy = this.handleCopy.bind(this);
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
    let toggle = !this.state.apiToggle;
    this.setState({ apiToggle: toggle });
  };

  handleCopy = e => {
    console.log("HANDLE COPY");
    this.inputRef.current.select();

    console.log("STEP 2");
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.

    console.log("STEP 3");
    e.target.focus();
    console.log("COPIED");
    // this.setState({ copySuccess: 'Copied!' });
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
          />
          {/* <div className="toggle-clipboard-group">
            <div className="copy-to-clipboard" onClick={this.handleCopy}>
              copy to clipboard
            </div> */}
          <Toggle
            toggle={this.state.apiToggle}
            label={"Show API Key"}
            onClick={this.handleToggle}
          />
          {/* </div> */}
        </div>
        {this.renderButton("Delete Robot")}
      </div>
    );
  }
}
