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

  componentDidMount() {
    console.log(this.props.server);
    let { settings } = this.props.membership;
    // console.log("Settings ChecK: ", settings);
    if (!settings.hasOwnProperty("enable_notifications"))
      settings.enable_notifications = true;
    this.setState({ settings: settings, compareSettings: settings });
  }

  doSubmit() {
    console.log("submit");
  }

  handleNotificationToggle = () => {
    let { settings } = this.state;
    settings.enable_notifications = !settings.enable_notifications;
    this.setState({ settings: settings });
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
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
