import React, { Component } from "react";
import Chat from "../chat/chat";
import { socketEvents } from "../../../services/sockets/events";

const { DISPLAY_CHAT_ROOMS } = socketEvents;

export default class Channels extends Component {
  state = {
    channels: []
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

  channelListener = async () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      await socket.on(DISPLAY_CHAT_ROOMS, data => {
        this.setState({ channels: data });
      });
    }
  };

  displayChannels = () => {
    const { channels } = this.state;
    return channels.map(channel => {
      return <div key={channel.id}>{channel.name}</div>;
    });
  };

  render() {
    const { socket, user } = this.props;
    return (
      <React.Fragment>
        Test
        <div>{this.displayChannels()}</div>
        <Chat user={user} socket={socket} />
      </React.Fragment>
    );
  }
}
