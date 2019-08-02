import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Channels from "../../layout/robotServer/channels";
import RobotServer from "../../layout/robotServer/robotServer";

export default class ServerPage extends Component {
  constructor(props) {
    super(props);
    console.log("a", this.props);
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    this.handleSelectedServer();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.name !== prevProps.match.params.name ||
      this.props.robotServers.length !== prevProps.robotServers.length
    ) {
      this.handleSelectedServer();
    }
  }

  handleSelectedServer = () => {
    let found = false;
    this.props.robotServers.map(robotServer => {
      if (robotServer.server_name === this.props.match.params.name) {
        this.props.setServer(robotServer);
        found = true;
        return true;
      }
      return false;
    });

    if (!found) {
      this.setState({ redirect: true });
    }
  };

  handleEmits = () => {
    //socket.emit(GET_CHANNELS, { user: user.id, server_id: server_id });
    //socket.emit(GET_ROBOTS, { server_id: server_id });
  };

  render() {
    if (this.state.redirect) return <Redirect to="/" />;
    return this.props.selectedServer ? (
      <Channels
        user={this.props.user}
        selectedServer={this.props.selectedServer}
        modal={this.props.modal}
        isModalShowing={this.props.isModalShowing}
        onCloseModal={this.props.onCloseModal}
      />
    ) : (
      <React.Fragment />
    );
  }
}
