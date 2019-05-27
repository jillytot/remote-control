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

  // componentDidUpdate(prevProps) {
  //   if (prevProps.users !== this.props.users) {
  //     console.log("Test state change");
  //     //this.colorUsers(this.props.users);
  //   }
  // }

  componentDidMount() {
    this._isMounted = true;
    this.chatListener();
    this.setState({ users: this.props.users });
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

  getMessageColors = () => {
    const { users } = this.props;
    const { chatroom } = this.state;
    return chatroom.messages.map(message => {
      console.log(" Message from getMessageColors: ", message);
      const user = users.find(user => {
        return user.username === message.sender;
      });
      if (user && user.color) {
        console.log("Updating message color");
        return {
          ...message,
          color: user.color
        };
      }
      return message;
    });
  };

  render() {
    const { onEvent, user, users, socket } = this.props;
    const { chatroom } = this.state;

    return (
      <div>
        {chatroom ? (
          <div className="chat-container">
            <div className="messages-container">
              <div className="chat-header-container">
                <div className="chat-title">
                  {chatroom ? chatroom.name : "Untitled"}
                </div>
                <div className="toggle-users"> Chat | Users </div>
              </div>
              <Messages
                messages={chatroom ? this.getMessageColors() : []}
                users={users}
              />
              <SendChat
                onEvent={onEvent}
                user={user}
                socket={socket}
                chatId={chatroom ? chatroom.id : ""}
              />
            </div>
            <UserList users={users} colors={colors} />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
