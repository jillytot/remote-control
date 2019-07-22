import React, { Component } from "react";
import DisplayRobotServer from "./displayRobotServer";
import "./robotServer.css";
import AddServer from "./modals/addServer";

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
    let followedLive = [];
    let live = [];
    let followed = [];
    let rest = [];

    robotServers.map(server => {
      if (
        followedServers.includes(server.server_id) &&
        server.status.liveDevices &&
        server.status.liveDevices.length > 0
      ) {
        server.followed = true;
        followedLive.push(server);
      } else if (
        followedServers.includes(server.server_id) &&
        server.status.liveDevices &&
        server.status.liveDevices.length <= 0
      ) {
        server.followed = true;
        followed.push(server);
      } else if (
        server.status.liveDevices &&
        server.status.liveDevices.length > 0
      ) {
        server.followed = false;
        live.push(server);
      } else {
        server.followed = false;
        rest.push(server);
      }
    });

    const sorted = followedLive.concat(followed, live, rest);
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
