import React, { Component } from "react";
import DisplayRobotServer from "./displayRobotServer";
import "./robotServer.css";
import AddServer from "./modals/addServer";
import Browse from "../../routing/servers/browse";
import sortServers from "./sortServers";

export default class RobotServer extends Component {
  displayServers = servers => {
    return servers.map(server => {
      return (
        <DisplayRobotServer
          key={server.server_id}
          defaultChannel={server.settings.default_channel}
          serverName={server.server_name}
          displayClasses={this.handleActive(server)}
          liveDevices={
            server.status.liveDevices ? server.status.liveDevices : []
          }
          followed={server.followed}
        />
      );
    });
  };

  handleSorting = servers => {
    const { robotServers, followedServers } = this.props;

    //const sorted = followedLive.concat(followed, live, rest);
    const sorted = sortServers(robotServers, followedServers);
    return this.displayServers(sorted);
  };

  handleActive = server => {
    if (
      this.props.selectedServer &&
      server.server_id === this.props.selectedServer.server_id
    ) {
      return "display-robot-server-container selected-server";
    } else {
      return "display-robot-server-container";
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="robot-server-container">
          {this.handleSorting(this.props.robotServers)}
          <Browse />
          <AddServer
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
          />
          ...
        </div>
      </React.Fragment>
    );
  }
}
