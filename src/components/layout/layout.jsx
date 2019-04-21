import React, { Component } from "react";
import io from "socket.io-client";
import { TEST_EVENT } from "../../services/sockets/events";

const socketUrl = "http://localhost:3231";
export default class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null
    };
  }

  componentDidMount() {
    this.initSocket();
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

  render() {
    return (
      <div>
        {this.state.socket !== null ? (
          <div>
            <div> Socket Connected </div>
            <button onClick={this.handleClick}>Boop</button>
          </div>
        ) : (
          <div> Socket Offline </div>
        )}
      </div>
    );
  }
}
