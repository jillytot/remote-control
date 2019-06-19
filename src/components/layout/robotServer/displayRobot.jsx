import React, { Component } from "react";
import "./robotServer.css";
import axios from "axios";
import { socketEvents } from "../../../events/events";

const { GET_ROBOTS } = socketEvents;

export default class DisplayRobot extends Component {
  state = {};

  componentDidMount() {}

  socketListener = () => {
    const { socket } = this.props;
    if (socket) {
      socket.on(GET_ROBOTS, robots => {
        //List Robots
      });
    }
  };

  handleDisplay = () => {
    const { server, user, channels } = this.props;
    console.log(this.props);
    if (server && user && user.id === server.owner_id) {
      return (
        <div className="display-robot-container">
          <div className="display-robot-header">Manage Robots: </div>
          <div className="display-robot-item"> Robot 1</div>
          <div className="display-robot-item"> Robot 2</div>
          <div className="display-robot-item"> Robot 3</div>
          <AddRobot
            server={server}
            user={user}
            channels={channels}
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
          />
        </div>
      );
    }
  };

  render() {
    return <div>{this.handleDisplay()}</div>;
  }
}

class AddRobot extends Component {
  handleModal = () => {
    return [
      {
        body: "Add Robot"
      },
      { header: "" },
      { footer: "" }
    ];
  };

  handleDisplayAddRobot() {
    const { server, user, channels } = this.props;
    if (channels && channels.length > 0 && user.id === server.owner_id) {
      return (
        <div
          className="add-channel"
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          {" "}
          + Add Robot ...
        </div>
      );
    }
    return <React.Fragment />;
  }

  render() {
    return <React.Fragment>{this.handleDisplayAddRobot()}</React.Fragment>;
  }
}
