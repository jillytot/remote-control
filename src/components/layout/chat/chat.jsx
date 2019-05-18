import React, { Component } from "react";
import {
  MESSAGE_RECIEVED,
  socketEvents
} from "../../../services/sockets/events";
import UserList from "./userList.jsx";
import Messages from "./messages";
import SendChat from "./sendChat";
import "./chat.css";
import { colors } from "../../../config/colors";
const { SEND_CHAT } = socketEvents;

export default class Chat extends Component {
  _isMounted = false;
  //This component will rely entirely on props passed into it to build the state.
  //@param socket { object } is the websocket listener passed in
  //@param users { object } gets populated when socket receives USERS event

  state = {
    storeUsers: [],
    users: []
  };

  componentDidUpdate(prevProps) {
    if (this.state.storeUsers !== this.props.users)
      this.setState({ storeUsers: this.props.users });
  }

  componentDidMount() {
    this._isMounted = true;
    this.chatListener();
    this.setState({ storeUsers: this.props.users });
    this.colorUsers(this.state.storeUsers);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  chatListener = async () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      socket.on(SEND_CHAT, chat => {
        this.setState({ chatroom: chat });
      });
      socket.on(MESSAGE_RECIEVED, message => {
        if (this.state.chatroom) {
          let { chatroom } = this.state;
          chatroom.messages.push(message);
          this.setState({ chatroom });
        }
      });
    }
  };

  generateColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //Fix this later
  colorUsers = users => {
    console.log("test 1 ", users);
    Object.keys(users).map(mapUser => {
      console.log("test 2 ", mapUser);
      if (!mapUser.color) {
        let getColor = this.generateColor();
        console.log("test 3");
        return (users[mapUser].color = getColor);
      }
      return users;
    });
    console.log("Users from colorUsers: ", users);
    this.setState({ users: users });
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
