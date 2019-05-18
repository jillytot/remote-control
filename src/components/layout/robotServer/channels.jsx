import React, { Component } from "react";
import Chat from "../chat/chat";
import { socketEvents } from "../../../services/sockets/events";

const { SEND_ROBOT_SERVER_INFO, GET_CHAT, ACTIVE_USERS_UPDATED } = socketEvents;

export default class Channels extends Component {
  state = {
    channels: [],
    users: []
  };

  //not sure if needed, but why not
  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
      this.displayChannels();
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.channelListener();
  }

  channelListener = () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      socket.on(SEND_ROBOT_SERVER_INFO, data => {
        this.setState({ channels: data.channels, users: data.users });
      });
      socket.on(ACTIVE_USERS_UPDATED, users => {
        this.setState({ users: users });
      });
    }
  };

  handleClick = chatId => {
    console.log("Clicked!");
    const { socket } = this.props;
    socket.emit(GET_CHAT, chatId);
  };

  displayChannels = () => {
    const { channels } = this.state;
    return channels.map(channel => {
      return (
        <div
          className="list-channels"
          key={channel.id}
          onClick={() => this.handleClick(channel.id)}
        >
          {channel.name}
        </div>
      );
    });
  };

  render() {
    const { socket, user } = this.props;
    const { users } = this.state;
    return (
      <React.Fragment>
        <div>{this.displayChannels()}</div>
        {users !== [] ? (
          <Chat user={user} socket={socket} users={users} />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}
