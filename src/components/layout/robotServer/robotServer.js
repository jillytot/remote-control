import React, { Component } from "react";
import { listRobotServers } from "../../../config/clientSettings";
import axios from "axios";

export default class RobotServer extends Component {
  state = {
    robotServers: []
  };

  async componentDidMount() {
    await this.getServers();
  }

  getServers = async () => {
    axios.get(listRobotServers).then(response => {
      console.log(response);
      this.setState({ robotServers: response.data });
    });
  };

  displayServers = servers => {
    console.log("From Servers: ", servers);
    return servers.map(server => {
      return <div key={server.server_id}> {server.server_name}</div>;
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.robotServers !== []
          ? this.displayServers(this.state.robotServers)
          : "Fetching Servers"}
      </React.Fragment>
    );
  }
}
