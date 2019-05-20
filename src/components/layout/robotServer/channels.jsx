import React, { Component } from "react";
import Chat from "../chat/chat";
import { socketEvents } from "../../../services/sockets/events";
import { colors } from "../../../config/colors";
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

  generateColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //Get users from props
  //See if user is in state, if so do nothing, if not add a color, and save them
  //V-2 if a user has been removed from props, remove them from state
  getUserColors = users => {
    return users.map(user => {
      if (!user.color) {
        const generatedColor = this.generateColor();
        return {
          ...user,
          color: generatedColor
        };
      }
      return user;
    });
  };

  channelListener = () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      //Currently doesn't handle channels being dynamically updated
      socket.on(SEND_ROBOT_SERVER_INFO, data => {
        console.log("SEND ROBOT SERVER INFO: ", data);
        this.setState({
          channels: data.channels,
          users: this.getUserColors(data.users)
        });
      });
      socket.on(ACTIVE_USERS_UPDATED, users => {
        this.setState({ users: this.getUserColors(users) });
      });
    }
  };

  handleClick = chatId => {
    console.log("GET CHAT! ", chatId);
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
