import React, { Component } from "react";
import { MESSAGE_RECEIVED, SEND_CHAT } from "../../../events/definitions";
import UserList from "./userList.jsx";
import Messages from "./messages";
import SendChat from "./sendChat";
import "./chat.css";
import { colors } from "../../../config/colors";
import socket from "../../socket";

export default class Chat extends Component {
  _isMounted = false;
  //This component will rely entirely on props passed into it to build the state.
  //@param socket { object } is the websocket listener passed in
  //@param users { object } gets populated when socket receives USERS event

  state = {
    storeUsers: [],
    users: [],
    menu: "Chat",
    chatLoaded: false
  };

  componentDidMount() {
    this._isMounted = true;
    this.chatListener();
    this.setState({ users: this.props.users });
    socket.on("LOCAL_MODERATION", data => {
      console.log("DING");
      this.handleLocalChatModeration(data);
    });
  }

  handleLocalChatModeration = data => {
    console.log("MODERATION EVENT: ", data);
    if (data.event === "remove_messages" && this.state.chatroom) {
      console.log("REMOVING MESSAGES");
      let { messages } = this.state.chatroom;
      let remove = [];
      messages.map(message => {
        if (message.sender_id === data.user) {
          message.type = "moderation";
          message.message = " ...message removed...";
        }
        remove.push(message);
      });
      let updateChat = this.state.chatroom;
      updateChat.messages = remove;
      this.setState({ chatroom: updateChat });
    }
  };

  componentWillUnmount() {
    socket.off("LOCAL_MODERATION", this.handleLocalChatModeration);
    this._isMounted = false;
  }

  removeModerationMessagesOnLoad = messages => {
    let remove = [];
    messages.map(message => {
      if (message.type === "moderation") {
        //do nothing
      } else {
        remove.push(message);
      }
    });
    return remove;
  };
  chatListener = async () => {
    const { socket } = this.props;
    if (socket && this._isMounted) {
      socket.on(SEND_CHAT, chat => {
        // const messages = chat.messages;
        // messages.map(message => {
        //   chat.messages.push(message);
        // });
        chat.messages = this.removeModerationMessagesOnLoad(chat.messages);
        this.setState({ chatroom: chat });
      });
      socket.on(MESSAGE_RECEIVED, message => {
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

  handleDisplayMessages = () => {
    const { users } = this.props;

    return <Messages messages={this.getMessageColors()} users={users} />;
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
      // console.log("Menu", menu);
      if (menu === "Chat") {
        return (
          <div className="messages-container">
            <div className="chat-background">
              {this.handleDisplayMessages()}
            </div>
            <SendChat
              onEvent={onEvent}
              user={user}
              socket={socket}
              chatId={chatroom ? chatroom.id : ""}
              server_id={chatroom ? chatroom.host_id : ""}
              onChatFeedback={this.handleChatFeedback}
              setChatTabbed={this.props.setChatTabbed}
              chatTabbed={this.props.chatTabbed}
            />
          </div>
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
      <div>
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
      </div>
    );
  }
}

let previousFeedback = "";

// chatroom.messages.map(message => {
//   if (usernamesToKeep.includes(message.sender) !== true) {
//     usernamesToKeep.push(message.sender);
//   }
// });

// componentWillUnmount() {
//   clearInterval(this.colorCleanup);
//   document.removeEventListener("keydown", this.handleKeyPress);
// }
