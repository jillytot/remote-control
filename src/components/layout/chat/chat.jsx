import React, { Component } from "react";
import { MESSAGE_RECIEVED, socketEvents } from "../../../events/events";
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
    users: [],
    menu: "Chat"
  };

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

  handleChatFeedback = fromSendChat => {
    let push = true;
    if (previousFeedback === fromSendChat.id) {
      push = false;
    }
    console.log("HANDLE CHAT FEEDBACK", fromSendChat.id);
    let { chatroom } = this.state;

    if (push) {
      chatroom.messages.push(fromSendChat);
      this.setState({ chatroom });
      previousFeedback = fromSendChat.id;
    }
  };

  getMessageColors = () => {
    const { users } = this.props;
    const { chatroom } = this.state;
    return chatroom.messages.map(message => {
      // console.log(" Message from getMessageColors: ", message);
      const user = users.find(user => {
        return user.username === message.sender;
      });
      if (user && user.color) {
        // console.log("Updating message color");
        return {
          ...message,
          color: user.color
        };
      }
      return message;
    });
  };

  handleMenuSelect = selected => {
    console.log(selected);
    this.setState({ menu: selected });
  };

  handleMenuItem = option => {
    return (
      <span
        className="menu-option"
        onClick={() => this.handleMenuSelect(option.label)}
      >
        {option.label}
      </span>
    );
  };

  handleReturnOptions = () => {
    if (this.state.menu) {
      const { onEvent, user, users, socket } = this.props;
      const { chatroom, menu } = this.state;
      console.log("Menu", menu);
      if (menu === "Chat") {
        return (
          <React.Fragment>
            <div className="messages-container">
              <div className="chat-background">
                <Messages
                  messages={chatroom ? this.getMessageColors() : []}
                  users={users}
                />
              </div>
            </div>
              <SendChat
                onEvent={onEvent}
                user={user}
                socket={socket}
                chatId={chatroom ? chatroom.id : ""}
                server_id={chatroom ? chatroom.host_id : ""}
                onChatFeedback={this.handleChatFeedback}
              />
          </React.Fragment>
        );
      }
      if (menu === "Users") {
        return <UserList users={users} colors={colors} />;
      }
      return "...";
    }
  };

  render() {
    const { chatroom } = this.state;

    return (
      <React.Fragment>
        {chatroom ? (
          <div className="chat-container">
            <div className="chat-header-container">
              <div className="chat-title">
                {chatroom ? chatroom.name : "Untitled"}
              </div>
              <div className="toggle-users">
                {this.handleMenuItem({ label: "Chat" })} |
                {this.handleMenuItem({ label: "Users" })}
              </div>
            </div>
            {this.handleReturnOptions()}
          </div>
        ) : (
          <div />
        )}
      </React.Fragment>
    );
  }
}

let previousFeedback = "";
