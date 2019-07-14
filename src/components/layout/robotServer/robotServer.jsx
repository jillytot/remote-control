import React, { Component } from "react";
import DisplayRobotServer from "./displayRobotServer";
import "./robotServer.css";
import AddServer from "./modals/addServer";


export default class RobotServer extends Component {
  displayServers = servers => {
    //console.log("From Servers: ", servers);
    return this.props.robotServers.map(server => {
      //console.log("Server Name: ", server.server_name);
      return (
        <DisplayRobotServer
          key={server.server_id}
          defaultChannel={server.settings.default_channel}
          serverName={server.server_name}
          displayClasses={this.handleActive(server)}
        />
      );
    });
  };

  handleActive = server => {
    if (this.props.selectedServer && server.server_id === this.props.selectedServer.server_id){
      return "display-robot-server-container selected-server";
    } else {
      return "display-robot-server-container";
    }
  };

  /*
  handleClick = e => {
    const { server_id } = e;
    this.setState({ selectedServer: e });
    console.log("Server Selected ", e.server_name);
    const { user } = this.props;
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
    //this.props.setServer(e);
  };
  */

  render() {
    return (
      <React.Fragment>
        <div className="robot-server-container">
          {this.displayServers(this.props.robotServers)}
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
