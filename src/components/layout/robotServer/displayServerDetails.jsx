import React, { Component } from "react";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";
import axios from "axios";
import { joinServer, leaveServer } from "../../../config/clientSettings";

/*
Todo: 
Join Server: 
Users will automatically get listed as "guests" until they join. 
Once they join, call the server and check for valid "member" role, 
If they have a member role, display "joined" state. 

Before joining: 
<3 Join Count

On Join: 
<3 Joined Count
onhover: 
<3 Leave Count
*/

export default class DisplayServerDetails extends Component {
  state = {
    publicInvite: null,
    currentStatus: null,
    localStatus: null,
    hoverText: "Joined"
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.server.server_id !== this.props.server.server_id &&
      this.props.socket
    ) {
      this.handleGetLocalStatus();
    }
  }

  async componentDidMount() {
    this.setState({ currentStatus: this.props.server.server_id });
    this.initSocket();
  }

  handleGetLocalStatus = () => {
    const { socket } = this.props;
    socket.emit("GET_LOCAL_STATUS", {
      server_id: this.props.server.server_id,
      user_id: this.props.user.id
    });
  };

  initSocket = () => {
    const { socket } = this.props;
    if (socket) {
      this.handleGetLocalStatus();
      socket.on("SEND_LOCAL_STATUS", status => {
        console.log("GET LOCAL STATUS!", status);
        this.setState({ localStatus: status });
      });
    }
  };

  handleJoinClick = () => {
    const { server, invites } = this.props;
    console.log("CHECK INVITES: ", invites);
    const token = localStorage.getItem("token");

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
    this.setState({ hoverText: "Leave Server" });
  };

  handleMouseLeave = () => {
    this.setState({ hoverText: "Joined" });
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
              <div className="follow-icon">
                <Icon icon={ICONS.FOLLOW} />
              </div>
              <div>
                {this.state.localStatus &&
                this.state.localStatus.member === true
                  ? this.state.hoverText
                  : "Join server"}
              </div>
            </div>

            <div className="member-count"> Count </div>
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
