import React, { Component } from "react";
import "../../../../styles/common.css";
import Input from "../../../common/input";
import Toggle from "../../../common/toggle";
import { deleteRobot, robotAPIKey } from "../../../../config/clientSettings";

import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class RobotSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, apiToggle: false, apiKey: "", copied: false };
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
          <div className="toggle-clipboard-group">
            <CopyToClipboard text={this.state.apiKey}
              onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <button className="btn btn-small" title="Click to copy again">Copied OK</button> : <button className="btn btn-small">Copy to clipboard</button>}
            </CopyToClipboard>
          </div>
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
