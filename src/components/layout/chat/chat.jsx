import React, { Component } from "react";
import { USERS } from "../../../services/sockets/events";
import UserList from "./userList.jsx";
import Messages from "./messages";
import "./chat.css";

export default class Chat extends Component {
  //This component will rely entirely on props passed into it to build the state.
  //@param socket { object } is the websocket listener passed in
  //@param users { object } gets populated when socket receives USERS event
  state = {};

  async componentDidMount() {
    const { socket } = (await this.props.socket) !== null;
    socket ? this.setState({ socket: socket }) : console.log("Loading Socket");
    this.chatListener();
  }

  componentDidUpdate(prevProps) {
    if (this.props.socket !== prevProps.socket) {
      const { socket } = this.props;
      //console.log("Updated state in Chat");
      this.setState({ socket: socket });
    }

    if (this.state.socket === null || this.state.socket === undefined) {
      this.props.socket
        ? this.setState({ socket: this.props.socket })
        : console.log("loading socket");
    }
  }

  chatListener = () => {
    if (this.state.socket) {
      const { socket } = this.state;
      socket.on(USERS, users => {
        //console.log("USERS", users);
        this.setState({ users });
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.users ? (
          <div className="chat-container">
            <Messages />
            <UserList users={this.state.users} />
          </div>
        ) : (
          <div>Loading Users</div>
        )}
      </div>
    );
  }
}
