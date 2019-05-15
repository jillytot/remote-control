import React, { Component } from "react";
import { listRobotServers } from "../../../config/clientSettings";
import axios from "axios";
import DisplayRobotServer from "./displayRobotServer";
import "./robotServer.css";

export default class RobotServer extends Component {
  state = {
    robotServers: []
  };

  async componentDidMount() {
    await this.getServers();
  }

  handleUpdateServers = () => {
    const { socket } = this.props;
    socket.on("ROBOT_SERVER_UPDATED", async () => {
      await this.getServers();
    });
  };

  getServers = async () => {
    axios.get(listRobotServers).then(response => {
      console.log(response);
      this.setState({ robotServers: response.data });
    });
  };

  displayServers = servers => {
    console.log("From Servers: ", servers);
    return servers.map(server => {
      console.log("Server Name: ", server.server_name);
      return (
        <DisplayRobotServer
          key={server.server_id}
          serverName={server.server_name}
        />
      );
    });
  };

  render() {
    return (
      <div className="robot-server-panel">
        {this.state.robotServers !== []
          ? this.displayServers(this.state.robotServers)
          : "Fetching Servers"}
      </div>
    );
  }
}
