import React, { Component } from "react";
import { listRobotServers } from "../../../config/clientSettings";
import axios from "axios";
import DisplayRobotServer from "./displayRobotServer";
import Channels from "./channels";
import "./robotServer.css";
import { socketEvents } from "../../../services/sockets/events";
const { ROBOT_SERVER_UPDATED, GET_CHAT_ROOMS } = socketEvents;

export default class RobotServer extends Component {
  state = {
    robotServers: []
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
        <div
          key={server.server_id}
          onClick={() => this.handleClick(server.server_id)}
        >
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
    console.log("Get Chat: ", e);
    const { socket, user } = this.props;
    socket.emit(GET_CHAT_ROOMS, { user: user.id, server_id: e });
    let { robotServers } = this.state;
    robotServers.map(server => {
      console.log("Mapping Servers: ", server);
      if (e === server.server_id) {
        server.active = true;
      } else {
        server.active = false;
      }
    });
    this.setState({ robotServers });
  };

  render() {
    const { socket, user } = this.props;
    return (
      <React.Fragment>
        <div className="server-channel-container">
          <div className="robot-server-container">
            {this.state.robotServers !== []
              ? this.displayServers(this.state.robotServers)
              : "Fetching Servers"}
          </div>
          <Channels socket={socket} user={user} />
        </div>
      </React.Fragment>
    );
  }
}
