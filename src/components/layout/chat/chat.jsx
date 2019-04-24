import React, { Component } from "react";
import { USERS_UPDATED } from "../../../services/sockets/events";
import UserList from "./userList.jsx";
import Messages from "./messages";
import "./chat.css";

export default class Chat extends Component {
  _isMounted = false;
  //This component will rely entirely on props passed into it to build the state.
  //@param socket { object } is the websocket listener passed in
  //@param users { object } gets populated when socket receives USERS event
  state = {};

  componentDidMount() {
    this._isMounted = true;
    this.chatListener();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  chatListener = () => {
    console.log("Chat Listener is Listening...");
    const { socket } = this.props;
    console.log(socket);
    if (socket && this._isMounted) {
      socket.on(USERS_UPDATED, users => {
        console.log("USERS", users);
        this.setState({ users });
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.users ? (
          <div className="chat-container">
            <Messages />
            <UserList users={this.state.users} />
          </div>
        ) : (
          <div>Loading Users</div>
        )}
      </div>
    );
  }
}
