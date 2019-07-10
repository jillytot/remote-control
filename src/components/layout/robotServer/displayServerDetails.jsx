import React, { Component } from "react";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";
import axios from "axios";
import { joinServer, leaveServer } from "../../../config/clientSettings";

export default class DisplayServerDetails extends Component {
  state = {
    joined: false,
    publicInvite: null
  };

  async componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    const { socket } = this.props;
    if (socket) {
      //do socket things
    }
  };

  handleJoinClick = () => {
    const { server, invites } = this.props;
    console.log("CHECK INVITES: ", invites);
    const { joined } = this.state;
    const token = localStorage.getItem("token");

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
        console.log(result.data);
      });
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
              className="heart-container"
              onClick={() => this.handleJoinClick()}
            >
              <div className="follow-icon">
                <Icon icon={ICONS.FOLLOW} />
              </div>
              <div> Join Server </div>
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
