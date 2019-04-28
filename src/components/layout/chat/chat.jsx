import React, { Component } from "react";
import { USERS_UPDATED } from "../../../services/sockets/events";
import UserList from "./userList.jsx";
import Messages from "./messages";
import SendChat from "./sendChat";
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
    const { socket } = this.props;
    if (socket && this._isMounted) {
      socket.on(USERS_UPDATED, users => {
        this.setState({ users });
      });
    }
  };

  render() {
    const { onEvent } = this.props;
    return (
      <div>
        {this.state.users ? (
          <div className="chat-container">
            <div className="messages-container">
              <Messages
                messages={
                  this.props.chatroom ? this.props.chatroom.messages : []
                }
              />
              <SendChat onEvent={onEvent} />
            </div>

            <UserList users={this.state.users} />
          </div>
        ) : (
          <div>Please login!</div>
        )}
      </div>
    );
  }
}
