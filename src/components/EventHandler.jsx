import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../settings/clientSettings";
import { HEARTBEAT } from "../services/sockets/events";

//Will likely move most of the interaction with the server to here.
export default class EventHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    };
  }

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
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
        socket.emit(HEARTBEAT, socket.id);
      });
    }
  };

  render() {
    const { socket, user } = this.state;
    return socket !== null ? (
      <Layout socket={socket} user={user} />
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}
