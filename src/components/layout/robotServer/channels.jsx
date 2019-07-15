import React, { Component } from "react";
import {
  SEND_ROBOT_SERVER_INFO,
  ACTIVE_USERS_UPDATED,
  CHANNELS_UPDATED
} from "../../../events/definitions";
import { colors } from "../../../config/colors";
import AddChannelForm from "./modals/addChannelForm";
import EditChannel from "./modals/editChannel";
import DisplayRobot from "./displayRobot";
import DisplayServerDetails from "./displayServerDetails";
import socket from "../../socket";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import Channel from "./channel";

//placeholder
//var chatroom = { messages: [{ sender: "user2" }] }; // (this.state.chatroom)
export default class Channels extends Component {
  state = {
    channels: null,
    users: [],
    userColors: {},
    currentChannel: null,
    storeSelectedServer: null,
    defaultLoaded: false,
    loadControls: "",
    chatTabbed: false
  };

  setChatTabbed = value => {
    this.setState({ chatTabbed: value });
  };

  // not sure if needed, but why not
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedServer.server_id !== this.props.selectedServer.server_id
    ) {
      this.handleServer();
    }
  }

  componentDidMount() {
    console.log("channels mount");
    this._isMounted = true;
    this.channelListener();
    this.handleServer();

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
    document.addEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = e => {
    if (e.keyCode === 9) {
      e.preventDefault();
      console.log(this.state.chatTabbed);
      this.setChatTabbed(!this.state.chatTabbed);
    }
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
    const { selectedServer } = this.props;

    if (socket && this._isMounted) {
      //Currently doesn't handle channels being dynamically updated
      socket.on(SEND_ROBOT_SERVER_INFO, data => {
        console.log("SEND ROBOT SERVER INFO: ", data);
        this.setState({
          channels: data.channels,
          users: this.getUserColors(data.users),
          invites: data.invites
        });
        //if (this.state.currentChannel) this.handleClick(data.channels[0]);
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

  handleServer = () => {
    socket.emit("GET_CHANNELS", {
      user: this.props.user.id,
      server_id: this.props.selectedServer.server_id
    });
    socket.emit("GET_ROBOTS", {
      server_id: this.props.selectedServer.server_id
    });
  };

  displayChannels = () => {
    const { channels, currentChannel } = this.state;

    return channels.map((channel, index) => {
      return (
        <div className="channel-container" key={index}>
          <Link
            className="channel-delink"
            to={`/${this.props.selectedServer.server_name}/${channel.id}`}
          >
            <div
              className={
                channel.id === currentChannel
                  ? "list-channels list-channels-selected"
                  : "list-channels"
              }
              key={channel.id}
            >
              {"# "}
              {channel.name}
            </div>
          </Link>
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

  setCurrentChannel = channel => {
    this.setState({ currentChannel: channel });
  };

  render() {
    const { user, selectedServer } = this.props;
    const { users, currentChannel, chatTabbed, channels } = this.state;

    if (!channels) return <React.Fragment />;

    return (
      <React.Fragment>
        <div className={this.handleDisplayChannels()}>
          <DisplayServerDetails
            server={selectedServer}
            channels={this.state.channels}
            user={user}
            users={users}
            socket={socket}
            invites={this.state.invites}
          />
          {this.displayChannels()}
          <AddChannel
            channels={this.state.channels}
            server={selectedServer}
            user={user}
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
          />
          <DisplayRobot
            channels={this.state.channels}
            server={selectedServer}
            user={user}
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
            socket={socket}
          />
        </div>
        <Switch>
          <Route
            path="/:name/:id"
            render={props => (
              <Channel
                {...props}
                user={user}
                users={users}
                currentChannel={currentChannel}
                setCurrentChannel={this.setCurrentChannel}
                chatTabbed={chatTabbed}
                setChatTabbed={this.setChatTabbed}
                channels={this.state.channels}
              />
            )}
          />
          <Route
            path="/:name"
            render={props => (
              <NoChannel
                {...props}
                setCurrentChannel={this.setCurrentChannel}
                channels={this.state.channels}
              />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    clearInterval(this.colorCleanup);
    document.removeEventListener("keydown", this.handleKeyPress);
  }
}

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

class NoChannel extends Component {
  componentDidMount() {
    this.props.setCurrentChannel(null);
  }

  render() {
    return <React.Fragment />;
  }
}
