import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../config/clientSettings";
import axios from "axios";
import { apiUrl } from "../config/clientSettings";

import {
  HEARTBEAT,
  LOCAL_CHAT,
  MESSAGE_RECIEVED,
  USER_CONNECTED,
  USER_DISCONNECTED
} from "../services/sockets/events";

const UserContext = React.createContext();

/*

This is the main state management component
Socket, User, & Session info will be passed down to components as props
Some components will emit data back to the server, 
This event handler will listen for the responses in most cases and
send updated data back down the pipe to trigger subsquent component behavior. 

Data struct prototype: 
{ 
  socket:     {},
  user: {     name: "", 
              id: "", 
              login: bool },
  session: {  sessionId: "",
              server: {}, 
              newMessages: [{}] }
}

*/
export default class EventHandler extends Component {
  state = {
    socket: null,
    user: null
  };

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
    this.checkLocalStorage();
  }

  setUser = async user => {
    const { socket } = this.state;
    await socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  checkLocalStorage = () => {
    const { socket } = this.state;
    const checkToken = localStorage.getItem("token");
    if (checkToken !== undefined && checkToken !== null) {
      //socket.emit("AUTHENTICATE", { token: checkToken });
      axios
        .post(`${apiUrl}/auth`, { token: checkToken })
        .then(response => {
          console.log("response: ", response);
        })
        .catch(error => {
          console.log(error);
        });
      console.log("Check Token: ", checkToken);
    }
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

    socket.on("VALIDATED", data => {
      // console.log(data);
      this.setState({ user: data });
    });

    socket.on(USER_DISCONNECTED, disconnectUser => {
      try {
        if (
          disconnectUser &&
          disconnectUser["name"] === this.state.user["name"]
        ) {
          this.setState({ user: null });
        } else {
          console.log(
            "Either someone else logged out, or there was an error with logging out"
          );
        }
      } catch (error) {
        console.log("disconnection error: ", error);
      }
    });
    if (socket !== null) {
      socket.on(HEARTBEAT, () => {
        let checkUser = this.state.user
          ? { userId: this.state.user.id, socketId: socket["id"] }
          : { userId: null, socketId: socket["id"] };
        socket.emit(HEARTBEAT, checkUser);
      });
      socket.on(LOCAL_CHAT, chat => {
        this.setState({ chatroom: chat });
      });

      socket.on(MESSAGE_RECIEVED, message => {
        if (this.state.chatroom) {
          let { chatroom } = this.state;
          chatroom.messages.push(message);
          this.setState({ chatroom });
        }
      });
    }
  };

  render() {
    const { socket, user, chatroom } = this.state;
    return socket !== null ? (
      <UserContext.Provider value={{ socket, user }}>
        <Layout
          socket={socket}
          user={user}
          chatroom={chatroom ? chatroom : null}
          setUser={this.setUser}
        />
      </UserContext.Provider>
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}
