import React, { Component } from "react";
import "./robotServer.css";
import { GET_ROBOTS } from "../../../events/definitions";
import list_robot from "../../../icons/singleIcons/list_robot.svg";
import AddRobotForm from "./modals/addRobotForm";
import RobotSettings from "./modals/robotSettings";
import socket from "../../socket";

export default class DisplayRobot extends Component {
  state = {
    robots: []
  };

  componentDidMount() {
    socket.on(GET_ROBOTS, this.socketRobotsHandler);
  }

  componentWillUnmount() {
    socket.off(GET_ROBOTS, this.socketRobotsHandler);
  }

  socketRobotsHandler = robots => {
    console.log("GET ROBOTS CHECK: ", robots);
    this.setState({ robots: robots });
  };

  handleListRobots = () => {
    const { robots } = this.state;
    if (robots && robots.length > 0) {
      return robots.map((robot, index) => {
        console.log(robot.name);
        return (
          <GetRobotSettings
            robot={robot}
            onCloseModal={this.props.onCloseModal}
            modal={this.props.modal}
            user={this.props.user}
            key={index}
          />
        );
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

class GetRobotSettings extends Component {
  handleModal = () => {
    const { onCloseModal } = this.props;
    return [
      {
        body: (
          <RobotSettings robot={this.props.robot} onCloseModal={onCloseModal} />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    return (
      <div
        className="robot-item-container"
        onClick={() => {
          this.props.modal(this.handleModal());
        }}
      >
        <img className="list-icon" src={list_robot} alt={"robot"} />
        <div className="display-robot-item">{this.props.robot.name}</div>
      </div>
    );
  }
}

class AddRobot extends Component {
  handleModal = () => {
    const { server, onCloseModal } = this.props;
    return [
      {
        body: <AddRobotForm server={server} onCloseModal={onCloseModal} />
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
