import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./browseServers.css";
import defaultImages from "../../../imgs/placeholders";
import sortServers from "../robotServer/sortServers";

export default class BrowseServers extends Component {
  state = {};

  componentDidMount() {
    this.props.setServer(null);
    // console.log(this.props);
  }

  handleSorting = () => {
    const { robotServers, followedServers } = this.props;
    const sorted = sortServers(robotServers, followedServers, "default");
    // console.log(sorted);
    return this.handleDisplayServers(sorted);
  };

  handleDisplayServers = servers => {
    return servers.map(server => {
      return (
        <DisplayBrowseServers
          key={server.server_id}
          defaultChannel={server.settings.default_channel}
          serverName={server.server_name}
          liveDevices={
            server.status.liveDevices ? server.status.liveDevices : []
          }
          followed={server.followed}
          count={server.status.count}
        />
      );
    });
  };

  render() {
    return (
      <div className="browse-servers-container">{this.handleSorting()}</div>
    );
  }
}

const DisplayBrowseServers = ({
  serverName,
  defaultChannel,
  liveDevices,
  count,
  followed
}) => {
  return (
    <Link to={`/${serverName}/${defaultChannel}`}>
      <div className="browse-robot-server-container">
        <img
          className={
            liveDevices.length > 0
              ? "browse-display-robot-server-img live"
              : "browse-display-robot-server-img"
          }
          alt=""
          src={defaultImages.default01}
        />
        <div className={"browse-display-robot-server"}>{serverName}</div>
        <div className="browse-display-robot-stats"> Members: {count}</div>
      </div>
    </Link>
  );
};
