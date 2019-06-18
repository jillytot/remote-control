import React, { Component } from "react";
import Chat from "../chat/chat";
import { socketEvents } from "../../../events/events";
import { colors } from "../../../config/colors";
import Robot from "../robot/robot";
import AddChannelForm from "./modals/addChannelForm";
import EditChannel from "./modals/editChannel";
const {
  SEND_ROBOT_SERVER_INFO,
  GET_CHAT,
  ACTIVE_USERS_UPDATED,
  CHANNELS_UPDATED
} = socketEvents;

//placeholder
//var chatroom = { messages: [{ sender: "user2" }] }; // (this.state.chatroom)
export default class Channels extends Component {
  state = {
    channels: [],
    users: [],
    userColors: {},
    currentChannel: null,
    storeSelectedServer: null,
    defaultLoaded: false
  };

  // not sure if needed, but why not
  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
      this.displayChannels();
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.channelListener();

    this.colorCleanup = setInterval(() => {
      const newColors = this.state.userColors;
      let usernamesToKeep = [];
      this.state.users.map(user => {
        usernamesToKeep.push(user.username);
        return null;
      });

      // chatroom.messages.map(message => {
      //   if (usernamesToKeep.includes(message.sender) !== true) {
      //     usernamesToKeep.push(message.sender);
      //   }
      // });

      Object.keys(colors).map(username => {
        if (usernamesToKeep.includes(username) !== true) {
          delete newColors[username];
        }
        return null;
      });
      // console.log(newColors);
      this.setState({ userColors: newColors });
    }, 30000); //garbage cleanup every 30s
    this.loadDefaultChannel();
  }

  loadDefaultChannel = () => {
    //const { channels, selectedServer } = this.props;
    const {
      currentChannel,
      defaultLoaded,
      channels,
      storeSelectedServer
    } = this.state;
    if (
      this.props.selectedServer &&
      this.props.selectedServer.server_id &&
      this.props.selectedServer.server_id !== storeSelectedServer
    ) {
      this.setState({
        storeSelectedServer: this.props.selectedServer.server_id,
        defaultLoaded: false,
        currentChannel: null
      });
    }
    if (currentChannel || defaultLoaded) return;

    if (channels && channels.length > 0) {
      console.log("LOADING DEFAULT CHANNEL");
      this.handleActiveChannel(channels[0]);
    }
    return;
  };

  handleActiveChannel = activeChannel => {
    console.log("LOAD CHANNEL", activeChannel);
    const { channels } = this.state;
    let storeChannels = channels.map(channel => {
      if (channel.id === activeChannel.id) {
        console.log(activeChannel, channel);
        channel.active = true;
      } else {
        channel.active = false;
      }
      return channel;
    });
    this.setState({ channels: storeChannels });
    this.setState({ currentChannel: activeChannel.id });
  };

  generateColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  getColor = username => {
    const { userColors } = this.state;
    const newColors = userColors;

    if (userColors.hasOwnProperty(username)) {
      return userColors[username];
    } else {
      const newColor = this.generateColor();
      newColors[username] = newColor;
      this.setState({ userColors: newColors });
      return newColor;
    }
  };

  //Get users from props
  //See if user is in state, if so do nothing, if not add a color, and save them
  //V-2 if a user has been removed from props, remove them from state
  getUserColors = users => {
    return users.map(user => {
      return {
        ...user,
        color: this.getColor(user.username)
      };
    });
  };

  channelListener = () => {
    const { socket, selectedServer } = this.props;

    if (socket && this._isMounted) {
      //Currently doesn't handle channels being dynamically updated
      socket.on(SEND_ROBOT_SERVER_INFO, data => {
        console.log("SEND ROBOT SERVER INFO: ", data);
        this.setState({
          channels: data.channels,
          users: this.getUserColors(data.users)
        });
        if (this.state.currentChannel) this.handleClick(data.channels[0]);
      });

      socket.on(ACTIVE_USERS_UPDATED, users => {
        this.setState({ users: this.getUserColors(users) });
      });

      socket.on(CHANNELS_UPDATED, data => {
        console.log("CHANNELS UPDATED: ", data, selectedServer);
        if (
          this.props.selectedServer &&
          data.server_id === this.props.selectedServer.server_id
        ) {
          console.log("UPDATING CHANNELS");
          this.setState({
            channels: data.channels
          });
        }
      });
    }
  };

  handleClick = channel => {
    this.handleActiveChannel(channel);
    const { socket } = this.props;
    const chatId = channel.chat;
    socket.emit(GET_CHAT, chatId);
  };

  displayChannels = () => {
    const { channels } = this.state;
    this.loadDefaultChannel();
    return channels.map((channel, index) => {
      return (
        <div className="channel-container" key={index}>
          <div
            className={
              channel.active
                ? "list-channels list-channels-selected"
                : "list-channels"
            }
            key={channel.id}
            onClick={() => this.handleClick(channel)}
          >
            {"# "}
            {channel.name}
          </div>
          <EditChannel
            channel={channel}
            server={this.props.selectedServer}
            user={this.props.user}
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
          />
        </div>
      );
    });
  };

  handleDisplayChannels = () => {
    if (this.state.channels && this.state.channels.length > 0) {
      return "list-channels-container";
    } else {
      return "";
    }
  };

  render() {
    const { socket, user, selectedServer } = this.props;
    const { users } = this.state;
    return (
      <React.Fragment>
        <div className={this.handleDisplayChannels()}>
          <DisplayServerDetails
            server={selectedServer}
            channels={this.state.channels}
            user={user}
            users={users}
          />
          {this.displayChannels()}
          <AddChannel
            channels={this.state.channels}
            server={selectedServer}
            user={user}
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
          />
        </div>
        {users !== [] ? (
          <React.Fragment>
            <Robot
              user={user}
              socket={socket}
              channel={this.state.currentChannel}
            />
            <Chat user={user} socket={socket} users={users} />
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    clearInterval(this.colorCleanup);
  }
}

const DisplayServerDetails = ({ server, channels, user, users }) => {
  if (channels && channels.length > 0) {
    return (
      <div className="server-info-container">
        <div className="display-server-name">
          {server.server_name}
          {user.id === server.owner_id ? (
            <div className="server-settings"> {`(edit)`}</div>
          ) : (
            <div className="server-settings" />
          )}
        </div>

        <div className="display-server-info">
          Users Online:
          <ActiveUserCount users={users} />
        </div>
      </div>
    );
  }
  return <React.Fragment />;
};

const ActiveUserCount = ({ users }) => {
  return <span> {users.length}</span>;
};

//Add Channel
class AddChannel extends Component {
  handleModal = () => {
    return [
      {
        body: (
          <AddChannelForm
            onCloseModal={this.props.onCloseModal}
            server={this.props.server}
          />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  handleDisplayAddChannel() {
    const { server, user, channels } = this.props;
    if (channels && channels.length > 0 && user.id === server.owner_id) {
      return (
        <div
          className="add-channel"
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          {" "}
          + Add Channel ...
        </div>
      );
    }
    return <React.Fragment />;
  }

  render() {
    return <React.Fragment>{this.handleDisplayAddChannel()}</React.Fragment>;
  }
}
