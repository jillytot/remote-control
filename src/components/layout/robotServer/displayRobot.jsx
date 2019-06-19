import React, { Component } from "react";
import "./robotServer.css";
import axios from "axios";
import { socketEvents } from "../../../events/events";

const { GET_ROBOTS } = socketEvents;

export default class DisplayRobot extends Component {
  state = {
    robots: []
  };

  componentDidMount() {
    this.socketListener();
  }

  socketListener = () => {
    const { socket } = this.props;
    if (socket) {
      socket.on(GET_ROBOTS, robots => {
        console.log("GET ROBOTS CHECK: ", robots);
        this.setState({ robots: robots });
      });
      console.log(this.state.robots);
    }
  };

  handleListRobots = () => {
    const { robots } = this.state;
    return robots.map((robot, index) => {
      console.log(robot.name);
      return (
        <div className="display-robot-item" key={index}>
          {robot.name}
        </div>
      );
    });
  };

  handleDisplay = () => {
    const { server, user, channels } = this.props;
    console.log(this.props);
    if (server && user && user.id === server.owner_id) {
      return (
        <div className="display-robot-container">
          <div className="display-robot-header">Manage Robots: </div>
          {this.handleListRobots()}
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
