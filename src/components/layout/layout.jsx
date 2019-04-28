import React, { Component } from "react";
import Login from "./login/login";
import User from "./nav/user";
import Chat from "./chat/chat";
import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT
} from "../../services/sockets/events";

import { LOGIN_TRUE } from "../localEvents";

export default class Layout extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  //Will slowly move all the event handling to the Event Handler.
  componentDidMount() {
    this._isMounted = true;
    this.handleResponse();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setUser = async user => {
    //console.log("set user", user);
    const { socket } = this.props;
    await socket.emit(USER_CONNECTED, user);
    this.setState({ user });
    this.props.onEvent(LOGIN_TRUE, user);
  };

  handleClick = e => {
    console.log("Handle Click");
  };

  //TODO: MOve these into the event handler
  handleResponse = () => {
    const { socket } = this.props;
    if (socket !== null) {
      //If there is a socket, do stuff!
      socket.on(USER_CONNECTED, user => {
        if (user) {
          this.setState({ user: user });
          console.log("User Connected: ", user);
        } else {
          console.log("Unable to get User");
        }
      });
      socket.on(USER_DISCONNECTED, disconnectUser => {
        if (disconnectUser && disconnectUser["id"] === this.state.user["id"]) {
          this.setState({ user: null });
        } else {
          console.log(
            "Either someone else logged out, or there was an error with logging out"
          );
        }
      });
    }
  };

  handleLogout = () => {
    const { user } = this.state;
    const { socket } = this.props;
    console.log("Handle Logout: ", user);
    user !== null
      ? socket.emit(LOGOUT, user, () => {
          console.log("Logging Out");
        })
      : console.log("User Logout Error");
  };

  render() {
    const { user } = this.state;
    const { socket, onEvent, chatroom } = this.props;
    return (
      <React.Fragment>
        {this.state.socket !== null ? (
          <React.Fragment>
            {!user ? (
              <Login socket={socket} setUser={this.setUser} onEvent={onEvent} />
            ) : (
              <React.Fragment>
                <User
                  user={user}
                  socket={socket}
                  onClick={this.handleLogout}
                  onEvent={onEvent}
                />
              </React.Fragment>
            )}
            <Chat
              socket={socket}
              user={user}
              onEvent={onEvent}
              chatroom={chatroom}
            />
          </React.Fragment>
        ) : (
          <div> Connection Offline </div>
        )}
      </React.Fragment>
    );
  }
}
