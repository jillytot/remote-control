import React, { Component } from "react";
import Chat from "../chat/chat";
import { socketEvents } from "../../../services/sockets/events";

const { DISPLAY_CHAT_ROOMS, GET_CHAT } = socketEvents;

export default class Channels extends Component {
  state = {
    channels: []
  };

  //not sure if needed, but why not
  // componentDidUpdate(prevState) {
  //   if (prevState !== this.state) {
  //     this.displayChannels();
  //   }
  // }

  componentDidMount() {
    this._isMounted = true;
    this.channelListener();
  }

  channelListener = async () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      await socket.on(DISPLAY_CHAT_ROOMS, data => {
        this.setState({ channels: data });
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
    return (
      <React.Fragment>
        <div>{this.displayChannels()}</div>
        <Chat user={user} socket={socket} />
      </React.Fragment>
    );
  }
}
