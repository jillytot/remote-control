import React from "react";
import Toggle from "../../common/toggle";
import Form from "../../common/form";
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
    let { settings } = this.props.server.membership;
    console.log("Settings ChecK: ", settings);
    if (!settings.hasOwnProperty("enable_notifications"))
      settings.enable_notifications = true;
    this.setState({ settings: settings });
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
      <div className="serverNotifications__modal">
        Notification Settings for:
        <span className="serverNotifications__header">
          {this.props.server.server_name}
        </span>
        <form onSubmit={this.handleSubmit}>
          <div className="serverNotifications__container">
            Email Notifications:
            <div className="serverNotifications__toggle-group">
              <span className="serverNotifications__info">
                Email when events happen on this server.
              </span>
              <Toggle
                toggle={this.state.settings.enable_notifications}
                label="Enable Notifications?"
                onClick={() => {}}
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
