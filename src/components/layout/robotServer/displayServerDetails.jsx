import React, { Component } from "react";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";
import axios from "axios";
import { joinServer, leaveServer } from "../../../config/clientSettings";
import socket from "../../socket";

export default class DisplayServerDetails extends Component {
  state = {
    publicInvite: null,
    currentStatus: null,
    localStatus: null,
    memberCount: "...",
    hoverText: "Joined",
    icon: <React.Fragment />
  };

  componentWillUnmount() {
    socket.off("SEND_LOCAL_STATUS", this.handleSocketLocalStatus);
    socket.off("SERVER_STATUS", this.handleSocketServerStatus);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.server &&
      !prevProps.server |
        (prevProps.server.server_id !== this.props.server.server_id)
    ) {
      this.handleGetLocalStatus();
      this.handleGetServerStatus();
      this.setState({ memberCount: "..." });
      this.setState({ icon: <React.Fragment /> });

      if (this.state.localStatus && this.state.localStatus.member) {
        this.setState({ icon: <Icon icon={ICONS.FOLLOW} color={"#FF0000"} /> });
      } else {
        this.setState({ icon: <Icon icon={ICONS.FOLLOW} /> });
      }
    }
  }

  async componentDidMount() {
    socket.on("SEND_LOCAL_STATUS", this.handleSocketLocalStatus);
    socket.on("SERVER_STATUS", this.handleSocketServerStatus);
    this.setState({ currentStatus: this.props.server.server_id });
    this.initSocket();

    if (this.state.localStatus && this.state.localStatus.member) {
      this.setState({ icon: <Icon icon={ICONS.FOLLOW} color={"#FF0000"} /> });
    } else {
      this.setState({ icon: <Icon icon={ICONS.FOLLOW} /> });
    }

    if (this.props.server.owner_id === this.props.user.id)
      this.setState({
        hoverText: "Members",
        icon: <Icon icon={ICONS.FOLLOW} color={"#FF0000"} />
      });
  }

  handleGetServerStatus = () => {
    console.log("GET SERVER STATUS CHECK");
    socket.emit("GET_SERVER_STATUS", {
      server_id: this.props.server.server_id
    });
  };

  handleGetLocalStatus = () => {
    socket.emit("GET_LOCAL_STATUS", {
      server_id: this.props.server.server_id,
      user_id: this.props.user.id
    });
  };

  handleMemberCount = () => {
    if (this.state.memberCount === "...") return this.props.server.status.count;
    return this.state.memberCount;
  };

  initSocket = () => {
    this.handleGetLocalStatus();
    this.handleGetServerStatus();
  };

  handleSocketLocalStatus = status => {
    console.log("GET LOCAL STATUS!", status);
    this.setState({ localStatus: status });
  };

  handleSocketServerStatus = status => {
    this.setState({ memberCount: status.count });
  };

  handleJoinClick = () => {
    const { server, invites } = this.props;
    console.log("CHECK INVITES: ", invites);
    const token = localStorage.getItem("token");

    if (this.props.server.owner_id === this.props.user.id) return; //Cannot join or leave server as it's owner
    if (this.state.localStatus && this.state.localStatus.member === true) {
      axios
        .post(
          leaveServer,
          {
            server_id: server.server_id,
            join: invites[0].id
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then(result => {
          if (result.data.status.member === false) this.handleGetLocalStatus();
        });
    } else {
      axios
        .post(
          joinServer,
          {
            server_id: server.server_id,
            join: invites[0].id
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then(result => {
          if (result.data.status.member) this.handleGetLocalStatus();
        });
    }
  };

  handleMouseEnter = () => {
    if (this.props.server.owner_id === this.props.user.id) {
    } else {
      if (this.state.localStatus && this.state.localStatus.member === true) {
        this.setState({
          hoverText: "Leave Server",
          icon: <Icon icon={ICONS.UNFOLLOW} color={"#FF0000"} />
        });
      }
      if (this.state.localStatus && this.state.localStatus.member === false) {
        this.setState({ icon: <Icon icon={ICONS.FOLLOW} color={"#FF0000"} /> });
      }
    }
  };

  handleMouseLeave = () => {
    if (this.props.server.owner_id === this.props.user.id) {
    } else {
      if (this.state.localStatus && this.state.localStatus.member === true) {
        this.setState({
          hoverText: "Joined",
          icon: <Icon icon={ICONS.FOLLOW} color={"#FF0000"} />
        });
      }

      if (this.state.localStatus && this.state.localStatus.member === false) {
        this.setState({ icon: <Icon icon={ICONS.FOLLOW} /> });
      }
    }
  };

  handleHoverText = () => {
    if (this.state.localStatus && this.state.localStatus.member === true) {
      return this.state.hoverText;
    }
    return "Join Server";
  };

  handleHeartIcon = () => {
    return this.state.icon;
  };

  displayDetails = () => {
    const { server, channels, user, users } = this.props;
    if (channels && channels.length > 0) {
      return (
        <div className="server-info-container">
          <div className="display-server-name">
            {server.server_name}
            {user.id === server.owner_id ? (
              <div className="server-settings"> {`(edit)`}</div>
            ) : (
              <div className="server-settings" />
            )}
          </div>
          <div className="join-server-container">
            <div
              className={
                this.state.localStatus && this.state.localStatus.member === true
                  ? "heart-container-joined"
                  : "heart-container"
              }
              onClick={() => this.handleJoinClick()}
              onMouseEnter={() => this.handleMouseEnter()}
              onMouseLeave={() => this.handleMouseLeave()}
            >
              <div className="follow-icon">{this.handleHeartIcon()}</div>
              <div>{this.handleHoverText()}</div>
            </div>

            <div className="member-count"> {this.handleMemberCount()} </div>
          </div>

          <div className="display-server-info">
            Users Online:
            <ActiveUserCount users={users} />
          </div>
        </div>
      );
    }
    return <React.Fragment />;
  };

  render() {
    return <React.Fragment>{this.displayDetails()}</React.Fragment>;
  }
}

const ActiveUserCount = ({ users }) => {
  return <span> {users.length}</span>;
};
