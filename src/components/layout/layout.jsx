import React, { Component } from "react";
import Login from "./login/login";
import User from "./nav/user";
import Chat from "./chat/chat";
import {
  TEST_EVENT,
  TEST_RESPONSE,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT
} from "../../services/sockets/events";

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

  setUser = user => {
    const { socket } = this.props;
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  handleClick = e => {
    const { socket } = this.props;
    socket.emit(TEST_EVENT);
    console.log("Message Sent: ", TEST_EVENT);
  };

  handleResponse = () => {
    const { socket } = this.props;
    if (socket !== null) {
      socket.on(TEST_RESPONSE, () => {
        console.log("Test Response!");
        socket.emit("Emitting Things");
      });
      socket.on(USER_CONNECTED, user => {
        user
          ? this.setState({ user: user })
          : console.log("Unable to get User");
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
    const { socket } = this.props;
    return (
      <div>
        {this.state.socket !== null ? (
          <div>
            <div> Socket Connected </div>
            <button className="btn" onClick={this.handleClick}>
              Boop
            </button>
            {!user ? (
              <Login socket={socket} setUser={this.setUser} />
            ) : (
              <div>
                Successfully logged in as:{" "}
                <User user={user} socket={socket} onClick={this.handleLogout} />
              </div>
            )}
            <Chat socket={socket} user={user} />
          </div>
        ) : (
          <div> Socket Offline </div>
        )}
      </div>
    );
  }
}
