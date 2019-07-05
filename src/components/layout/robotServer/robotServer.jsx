import React, { Component } from "react";
import { listRobotServers } from "../../../config/clientSettings";
import axios from "axios";
import DisplayRobotServer from "./displayRobotServer";
import "./robotServer.css";
import {
  ROBOT_SERVER_UPDATED,
  GET_CHANNELS,
  GET_ROBOTS
} from "../../../events/definitions";
import AddServer from "./modals/addServer";

export default class RobotServer extends Component {
  state = {
    robotServers: [],
    selectedServer: null //Has the user clicked on a server
  };

  async componentDidMount() {
    await this.getServers();
    this.handleUpdateServers();
  }

  handleUpdateServers = () => {
    const { socket } = this.props;
    socket.on(ROBOT_SERVER_UPDATED, async () => {
      await this.getServers();
    });
  };

  getServers = async () => {
    axios.get(listRobotServers).then(response => {
      //console.log(response);
      this.setState({ robotServers: response.data });
    });
  };

  displayServers = servers => {
    //console.log("From Servers: ", servers);
    return servers.map(server => {
      //console.log("Server Name: ", server.server_name);
      return (
        <div key={server.server_id} onClick={() => this.handleClick(server)}>
          <DisplayRobotServer
            key={server.server_id}
            serverName={server.server_name}
            displayClasses={this.handleActive(server)}
          />
        </div>
      );
    });
  };

  handleActive = server => {
    if (server.active) return "display-robot-server-container selected-server";
    return "display-robot-server-container";
  };

  handleClick = e => {
    const { server_id } = e;
    this.setState({ selectedServer: e });
    console.log("Server Selected ", e.server_name);
    const { socket, user } = this.props;
    socket.emit(GET_CHANNELS, { user: user.id, server_id: server_id });
    socket.emit(GET_ROBOTS, { server_id: server_id });
    let { robotServers } = this.state;
    robotServers.map(server => {
      if (server_id === server.server_id) {
        server.active = true;
      } else {
        server.active = false;
      }
      return null;
    });
    this.setState({ robotServers });
    this.props.getServer(e);
  };

  render() {
    return (
      <React.Fragment>
        <div className="robot-server-container">
          {this.state.robotServers !== []
            ? this.displayServers(this.state.robotServers)
            : "Fetching Servers"}
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
