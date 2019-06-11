import React, { Component } from "react";
import { listRobotServers } from "../../../config/clientSettings";
import axios from "axios";
import DisplayRobotServer from "./displayRobotServer";
import Channels from "./channels";
import "./robotServer.css";
import { socketEvents } from "../../../services/sockets/events";
import AddServer from "./addServer";
const { ROBOT_SERVER_UPDATED, GET_CHANNELS } = socketEvents;

export default class RobotServer extends Component {
  state = {
    robotServers: [],
    selectedServer: null //Has the user clicked on a server
  };

  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
      this.loadServerChannels();
    }
  }

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
  };

  loadServerChannels = () => {
    const { socket, user } = this.props;
    return (
      <Channels
        socket={socket}
        user={user}
        selectedServer={this.state.selectedServer}
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="server-channel-container">
          <div className="robot-server-container">
            {this.state.robotServers !== []
              ? this.displayServers(this.state.robotServers)
              : "Fetching Servers"}
            <AddServer input="derp" />
            ...
          </div>
          {this.loadServerChannels()}
        </div>
      </React.Fragment>
    );
  }
}
