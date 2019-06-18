import React, { Component } from "react";
import "./robotServer.css";

export default class DisplayRobot extends Component {
  state = {};

  handleDisplay = () => {
    const { server, user } = this.props;
    console.log(this.props);
    if (server && user && user.id === server.owner_id) {
      return (
        <div className="display-robot-container">
          <div className="display-robot-header">Manage Robots: </div>
          <div className="display-robot-item"> Robot 1</div>
          <div className="display-robot-item"> Robot 2</div>
          <div className="display-robot-item"> Robot 3</div>
        </div>
      );
    }
  };

  render() {
    return <div>{this.handleDisplay()}</div>;
  }
}
