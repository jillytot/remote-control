import React, { Component } from "react";
import { USERS } from "../../../services/sockets/events";

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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.socket !== prevProps.socket) {
      const { socket } = this.props;
      console.log("Updated state in Chat");
      this.setState({ socket: socket });
    }

    if (this.state.socket === null || this.state.socket === undefined) {
      this.props.socket
        ? this.setState({ socket: this.props.socket })
        : console.log("loading socket");
    }

    if (this.state.users && this.state.users !== prevState.users) {
      this.displayUsers();
    }
  }

  chatListener = () => {
    if (this.state.socket) {
      const { socket } = this.state;
      socket.on(USERS, users => {
        console.log("USERS", users);
        this.setState({ users });
      });
    }
  };

  displayUsers = () => {
    if (this.state.users) {
      let { users } = this.state;
      Object.keys(users).map(user => {
        console.log(user);
        return <li key="id"> {user["name"]}</li>;
      });
    } else {
      return <div>Loading Users</div>;
    }
  };

  render() {
    return (
      <div>
        <ul>{this.displayUsers()}</ul>
      </div>
    );
  }
}
