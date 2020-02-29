import React from "react";
import Toggle from "../../common/toggle";
import Form from "../../common/form";
import "./serverNotifications.scss";
import axios from "axios";
import InlineResponse from "../../common/inlineResult/inlineResult";
import { membershipSettings } from "../../../config/client/index";

export default class ServerNotifications extends Form {
  state = {
    data: {},
    errors: {},
    error: "",
    settings: {
      enable_notifications: null
    },
    compareSettings: {
      enable_notifications: null
    },
    status: ""
  };

  schema = {};

  componentDidMount = () => {
    let { settings } = this.props.membership;
    if (!settings.hasOwnProperty("enable_notifications"))
      settings.enable_notifications = true;
    this.setState({ settings: settings, compareSettings: settings });
  };

  doSubmit = async () => {
    const { settings } = this.state;
    this.setState({ status: "...pending." });
    const token = localStorage.getItem("token");
    await axios
      .post(
        membershipSettings,
        {
          settings
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log("Update membership settings result: ", res.data);
        if (res.data.error) {
          this.setState({ error: res.data.error });
        } else {
          this.setState({ status: "Changes saved successfully!" });
        }
      });
  };

  handleNotificationToggle = () => {
    this.setState(state => {
      return {
        settings: {
          ...state.settings,
          enable_notifications: !state.settings.enable_notifications
        }
      };
    });
  };

  handleButton = () => {
    const { settings, compareSettings } = this.state;
    if (JSON.stringify(settings) !== JSON.stringify(compareSettings)) {
      return this.renderButton("Save Changes");
    } else {
      return this.renderButton("Save Changes", "disabled");
    }
  };

  handleStatus = () => {
    const { status, error } = this.state;
    if (error)
      return (
        <InlineResponse message={error} onClose={this.props.onCloseModal} />
      );
    if (status)
      return (
        <InlineResponse
          message={status}
          type="success"
          onClose={this.props.onCloseModal}
        />
      );
    return <React.Fragment />;
  };

  render() {
    const { status, error } = this.state;
    return (
      <div className="modal">
        Server Settings:
        <span className="register-form-emphasis">
          {this.props.server.server_name}
        </span>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="serverNotifications__container">
            Email Notifications:
            <div className="serverNotifications__group">
              <span className="serverNotifications__info">
                Email me when events happen on this server.
              </span>
              <Toggle
                toggle={this.state.settings.enable_notifications}
                label="Enable Notifications?"
                onClick={this.handleNotificationToggle}
                critical={false}
              />
            </div>
          </div>
          {status === "" && error === ""
            ? this.handleButton()
            : this.handleStatus()}
        </form>
      </div>
    );
  }
}
