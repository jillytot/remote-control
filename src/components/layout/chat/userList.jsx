import React, { Component } from "react";
import "./chat.css";

export default class UserList extends Component {
  //TODO: Make user colors perminent for the duration the user is in the chatroom

  renderUsers = () => {
    const { users } = this.props;
    let usersRendered = [];
    return Object.keys(users).map(user => {
      let { username, id, color } = users[user];
      if (usersRendered.includes(id)) {
        //do nothing
        console.log(usersRendered.includes(id));
      } else {
        usersRendered.push(id);
        return (
          <div className={`user-list ${color}`} key={id}>
            {username}
          </div>
        );
      }
    });
  };

  render() {
    return (
      <div className="user-list-container">
        <div className="ulist">{this.renderUsers()}</div>
      </div>
    );
  }
}
