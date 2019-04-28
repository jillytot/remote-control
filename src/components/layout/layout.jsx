import React, { Component } from "react";
import Login from "./login/login";
import User from "./nav/user";
import Chat from "./chat/chat";

export default class Layout extends Component {
  render() {
    const { socket, onEvent, chatroom, user, setUser } = this.props;
    return (
      <React.Fragment>
        {socket !== null ? (
          <React.Fragment>
            {!user ? (
              <Login socket={socket} setUser={setUser} onEvent={onEvent} />
            ) : (
              <React.Fragment>
                <User user={user} socket={socket} onEvent={onEvent} />
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
