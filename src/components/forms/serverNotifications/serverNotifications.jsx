import React from "react";
import Toggle from "../../common/toggle";
import Form from "../../common/form";
import "./serverNotifications.scss";
// import axios from "axios";

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
    }
  };

  schema = {};

  componentDidMount = () => {
    console.log("Server Notifications Settings Component Mounted!");
    let { settings } = this.props.membership;
    if (!settings.hasOwnProperty("enable_notifications"))
      settings.enable_notifications = true;
    this.setState({ settings: settings, compareSettings: settings });
    console.log("TEST TOOO222OOOo2222ooo2o2o2o2o2o");
  };

  doSubmit() {
    console.log("submit");
  }

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
    console.log("Settings: ", settings, "Compare Settings: ", compareSettings);
    if (JSON.stringify(settings) !== JSON.stringify(compareSettings)) {
      return this.renderButton("Save Changes");
    } else {
      return this.renderButton("Save Changes", "disabled");
    }
  };

  render() {
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
          {this.handleButton()}
        </form>
      </div>
    );
  }
}
