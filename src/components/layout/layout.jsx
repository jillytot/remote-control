import React, { Component } from "react";
import Login from "./login/login";
import io from "socket.io-client";
import { TEST_EVENT, TEST_RESPONSE } from "../../services/sockets/events";

const socketUrl = "http://localhost:3231";
export default class Layout extends Component {
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
      console.log("Socket Connected: ", socket);
    });
    this.setState({ socket });
  };

  handleClick = e => {
    const { socket } = this.state;
    socket.emit(TEST_EVENT);
    console.log("Message Sent: ", TEST_EVENT);
  };

  handleResponse = () => {
    const { socket } = this.state;
    if (socket !== null) {
      socket.on(TEST_RESPONSE, () => {
        console.log("Test Response!");
        socket.emit("Emitting Things");
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.socket !== null ? (
          <div>
            <div> Socket Connected </div>
            <button className="btn" onClick={this.handleClick}>
              Boop
            </button>
            <Login socket={this.state.socket} />
          </div>
        ) : (
          <div> Socket Offline </div>
        )}
      </div>
    );
  }
}
