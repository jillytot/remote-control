import React, { Component } from "react";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";

export default class DisplayServerDetails extends Component {
  state = {};

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
            <div className="heart-container">
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

//= ({ server, channels, user, users }) => {
