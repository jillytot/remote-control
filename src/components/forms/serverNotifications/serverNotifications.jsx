import React from "react";
import Toggle from "../../common/toggle";
import Form from "../../common/form";

export default class ServerNotifications extends Form {
  state = {
    data: {},
    errors: {},
    error: "",
    settings: {
      enableNotifications: null
    },
    compareSettings: {
      enableNotifications: null
    }
  };

  componentDidMount() {
    let { settings } = this.props.user.local;
  }

  doSubmit() {
    console.log("submit");
  }

  render() {
    return (
      <div className="serverNotifications__container">
        Email Notifications:
        <div className="serverNotifications__toggle-group">
          <span className="serverNotifications__info">
            Email when events happen on this server.
          </span>
          <Toggle
            toggle={this.state.settings.enableNotifications}
            label="Enable Notifications?"
            onClick={() => {
              let { settings } = this.state;
              settings.enableNotifications = !settings.enableNotifications;
              this.setState({ settings: settings });
            }}
            critical={false}
          />
        </div>
      </div>
    );
  }
}
