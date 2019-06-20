import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../config/clientSettings";
import axios from "axios";
import { apiUrl } from "../config/clientSettings";
import {
  AUTHENTICATE,
  HEARTBEAT,
  USER_STATUS_UPDATED,
  USER_CONNECTED
} from "../events/definitions";

const UserContext = React.createContext();

/*

This is the main state management component
Socket, User, & Session info will be passed down to components as props
Some components will emit data back to the server, 
This event handler will listen for the responses in most cases and
send updated data back down the pipe to trigger subsquent component behavior. 


*/
export default class EventHandler extends Component {
  state = {
    socket: null,
    user: null
  };

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
    this.handleAuth(this.checkToken());
  }

  setUser = async user => {
    const { socket } = this.state;
    await socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  checkToken = () => {
    return localStorage.getItem("token");
  };

  handleAuth = token => {
    const { socket } = this.state;
    if (token) {
      socket.emit(AUTHENTICATE, { token: token });
      axios
        .post(`${apiUrl}/auth`, { token: token })
        .then(response => {
          console.log("response: ", response.data);
          if (response.data.user) {
            this.setState({ user: response.data.user });
          } else {
            console.log("Could not authenticate user.");
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    if (socket) {
      socket.on(HEARTBEAT, () => {
        if (this.state.user) {
          socket.emit(HEARTBEAT, {
            username: this.state.user.username,
            id: this.state.user.id
          });
        }
      });

      // if (user && user.status) {
      socket.on(USER_STATUS_UPDATED, updateStatus => {
        console.log("Updating User Status from Server: ", updateStatus);
        let updateUser = this.state.user;
        updateUser.status = updateStatus;
        this.setState({ user: updateUser });
      });
      // }
    }
  };

  render() {
    const { socket, user } = this.state;
    return socket !== null ? (
      <UserContext.Provider value={{ socket, user }}>
        <Layout
          socket={socket}
          user={user}
          setUser={this.setUser}
          handleAuth={this.handleAuth}
        />
      </UserContext.Provider>
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}
