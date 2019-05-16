import React, { Component } from "react";
import { USERS_UPDATED } from "../../../services/sockets/events";
import UserList from "./userList.jsx";
import Messages from "./messages";
import SendChat from "./sendChat";
import "./chat.css";
import { colors } from "../../../config/colors";

export default class Chat extends Component {
  _isMounted = false;
  //This component will rely entirely on props passed into it to build the state.
  //@param socket { object } is the websocket listener passed in
  //@param users { object } gets populated when socket receives USERS event

  state = {
    storeUsers: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.chatListener();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  chatListener = async () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      await socket.on(USERS_UPDATED, users => {
        this.colorUsers(users);
      });
    }
  };

  getChatRooms = async () => {
    //
  };

  generateColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  colorUsers = users => {
    Object.keys(users).map(mapUser => {
      if (!mapUser.color) {
        let getColor = this.generateColor();
        return (users[mapUser].color = getColor);
      }
      return users;
    });
    this.setState({ users });
  };

  setMessageColor = (messages, users) => {
    messages.map(message => {
      if (users[message.sender] && users[message.sender].color) {
        message.color = users[message.sender].color;
      } else {
        const { storeUsers } = this.state;
        let pushUsers = [];
        if (!storeUsers[message.sender]) {
          pushUsers = storeUsers;
          pushUsers.push({
            username: message.sender,
            color: this.generateColor()
          });
        }
      }
      return messages;
    });
    return messages;
  };

  render() {
    const { onEvent, user, socket } = this.props;

    return (
      <div>
        Chat Loaded
        {this.state.users ? (
          <div className="chat-container">
            <div className="messages-container">
              <Messages
                messages={
                  this.props.chatroom
                    ? this.setMessageColor(
                        this.props.chatroom.messages,
                        this.state.users
                      )
                    : []
                }
                users={this.state.users}
              />
              <SendChat onEvent={onEvent} user={user} socket={socket} />
            </div>
            <UserList users={this.state.users} colors={colors} />
          </div>
        ) : (
          <div>Wait.. where did the chat go?</div>
        )}
      </div>
    );
  }
}
