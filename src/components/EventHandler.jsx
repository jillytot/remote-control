import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../settings/clientSettings";
import {
  HEARTBEAT,
  MESSAGE_SENT,
  LOCAL_CHAT,
  MESSAGE_RECIEVED
} from "../services/sockets/events";
import { LOGIN_TRUE, SEND_CHAT } from "./localEvents";

//Will likely move most of the interaction with the server to here.
export default class EventHandler extends Component {
  state = {
    socket: null
  };

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
    this.handleEvents();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("Socket Connected: ", socket["id"]);
    });
    this.setState({ socket });
  };

  handleResponse = () => {
    const { socket } = this.state;
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
      //console.log("Send Chat to Server: ", obj);
      socket.emit(MESSAGE_SENT, {
        username: user.name,
        userId: user.id,
        message: obj
      });
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
      />
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}
