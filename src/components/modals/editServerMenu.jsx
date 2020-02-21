import React, { Component } from "react";
import EditServerForm from "./editServerForm";
import ServerNotifications from "../forms/serverNotifications/serverNotifications";

export default class EditServerMenu extends Component {
  state = {
    current: "server_settings"
  };

  componentDidMount() {
    const user = this.props.user;
    const server = this.props.selectedServer;
    if (!user.id === server.owner_id) {
      this.setState({ current: "member_settings" });
    }
  }

  render() {
    const { current } = this.state;
    return (
      <React.Fragment>
        {current === "server_settings" ? (
          <EditServerForm {...this.props} />
        ) : (
          <ServerNotifications {...this.props} />
        )}
      </React.Fragment>
    );
  }
}
