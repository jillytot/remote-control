import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../settings/clientSettings";
import {
  HEARTBEAT,
  MESSAGE_SENT,
  LOCAL_CHAT,
  MESSAGE_RECIEVED,
  USER_CONNECTED,
  USER_DISCONNECTED
} from "../services/sockets/events";
import { LOGIN_TRUE, SEND_CHAT } from "./localEvents";

/*

This is the main state management component
Socket info will be past to components for emitting events
The server responses will all route through here before getting passed back down as props

*/
export default class EventHandler extends Component {
  state = {
    socket: null,
    user: null
  };

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
    this.handleEvents();
  }

  setUser = async user => {
    //console.log("set user", user);
    const { socket } = this.state;
    await socket.emit(USER_CONNECTED, user);
    this.setState({ user });
    this.handleEvents(LOGIN_TRUE, user);
  };

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("Socket Connected: ", socket["id"]);
    });
    this.setState({ socket });
  };

  handleResponse = () => {
    const { socket } = this.state;

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
    if (socket !== null) {
      socket.on(HEARTBEAT, () => {
        let checkUser = this.state.user
          ? `${this.state.user["name"]}-${socket["id"]}`
          : socket["id"];
        socket.emit(HEARTBEAT, checkUser);
      });
      socket.on(LOCAL_CHAT, chat => {
        //console.log("Get chat from server: ", chat);
        this.setState({ chatroom: chat });
      });

      socket.on(MESSAGE_RECIEVED, message => {
        console.log("Chat message recieved: ", message);
        if (this.state.chatroom) {
          let { chatroom } = this.state;
          chatroom.messages.push(message);
          this.setState({ chatroom });
        }
      });
    }
  };

  handleEvents = (event, obj) => {
    const { socket, user } = this.state;
    //  if (event === USERNAME_TAKEN) {
    //    console.log("Username Taken!", obj);
    //    this.setState({ usernameTaken: obj });
    //  }
    if (event === LOGIN_TRUE) {
      this.setState({ user: obj });
    }

    if (event === SEND_CHAT) {
    }
  };

  render() {
    const { socket, user, chatroom } = this.state;
    return socket !== null ? (
      <Layout
        socket={socket}
        user={user}
        onEvent={this.handleEvents}
        chatroom={chatroom ? chatroom : null}
        setUser={this.setUser}
      />
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}
