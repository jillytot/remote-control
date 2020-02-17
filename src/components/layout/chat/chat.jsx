import React, { Component } from "react";
import { MESSAGE_RECEIVED, SEND_CHAT } from "../../../events/definitions";
import UserList from "./userList.jsx";
import Messages from "./messages";
import SendChat from "./sendChat";
import "./chat.css";
import { colors } from "../../../config/colors";
import socket from "../../socket";
import GetLayout from "../../modules/getLayout";
import { GlobalStoreCtx } from "../../providers/globalStore";

export default class Chat extends Component {
  _isMounted = false;

  state = {
    storeUsers: [],
    users: [],
    menu: "Chat",
    chatLoaded: false
  };

  onMount = () => {
    // console.log("chat did mount");
    this._isMounted = true;
    this.setState({ users: this.props.users });
    socket.on("LOCAL_MODERATION", this.handleLocalChatModeration);
    socket.on(SEND_CHAT, this.onSendChat);
    socket.on(MESSAGE_RECEIVED, this.onMessageRecieved);
    this.emitGetChat();
  };

  componentDidMount() {
    this.onMount();
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.channel &&
        !this.state.chatroom &&
        this.props.channel !== prevProps.channel) ||
      this.props.channels.length !== prevProps.channels.length
    ) {
      this.emitGetChat();
    }
  }

  emitGetChat = () => {
    // console.log("EMIT GET CHAT");
    const channel = this.props.channels.find(
      chan => chan.id === this.props.channel
    );

    if (channel) {
      socket.emit("GET_CHAT", channel.chat);
    }
  };

  handleLocalChatModeration = data => {
    // console.log("MODERATION EVENT: ", data);
    if (data.event === "remove_messages" && this.state.chatroom) {
      // console.log("REMOVING MESSAGES");
      let { messages } = this.state.chatroom;
      let remove = [];
      messages.forEach(message => {
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
    // console.log("chat did unmount");
    socket.off("LOCAL_MODERATION", this.handleLocalChatModeration);
    socket.off(SEND_CHAT, this.onSendChat);
    socket.off(MESSAGE_RECEIVED, this.onMessageRecieved);
    this._isMounted = false;
  }

  removeModerationMessagesOnLoad = messages => {
    let remove = [];
    messages.forEach(message => {
      if (message.type === "moderation" || message.type === "event") {
        //do nothing
      } else {
        remove.push(message);
      }
    });
    return remove;
  };

  onSendChat = chat => {
    chat.messages = this.removeModerationMessagesOnLoad(chat.messages);
    // console.log(chat);
    this.setState({ chatroom: chat });
  };

  onMessageRecieved = message => {
    if (this.state.chatroom) {
      let { chatroom } = this.state;
      chatroom.messages.push(message);
      this.setState({ chatroom });
    }
  };

  handleChatFeedback = fromSendChat => {
    let push = previousFeedback !== fromSendChat.id;

    // console.log("HANDLE CHAT FEEDBACK", fromSendChat.id);
    let { chatroom } = this.state;

    if (push) {
      chatroom.messages.push(fromSendChat);
      this.setState({ chatroom });
      previousFeedback = fromSendChat.id;
    }
  };

  handleDisplayMessages = () => {
    const { users } = this.props;

    return (
      <Messages
        messages={this.getMessageColors()}
        users={users}
        showMobileNav={this.props.showMobileNav}
        channels={this.props.channels}
      />
    );
  };

  getMessageColors = () => {
    const { chatroom } = this.state;
    return chatroom.messages.map(message => {
      return {
        ...message,
        color: this.props.getColor(message.sender || "nobody")
      };
    });
  };

  handleMenuSelect = selected => {
    // console.log(selected);
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
      const { users } = this.props;
      const { menu } = this.state;
      if (menu === "Chat") {
        return (
          <div className="messages-container">
            <div className="chat-background">
              {this.handleDisplayMessages()}
            </div>
            {this.loadSendChat()}
          </div>
        );
      }
      if (menu === "Users") {
        return <UserList users={users} colors={colors} />;
      }
      return "...";
    }
  };

  handleDefaultChatDisplay = () => {
    const { chatroom } = this.state;
    return (
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
    );
  };

  handleMobile = () => {
    return (
      <GlobalStoreCtx.Consumer>
        {({ canvas }) => {
          //also adjust on chat.css under @media only, then .message-container to edit chat messages layout
          const adjustCanvas = canvas - 8;
          return (
            <div className="messages-container">
              <div
                className="chat-background"
                style={{
                  height: adjustCanvas
                }}
              >
                {this.handleDisplayMessages()}
              </div>
              {this.loadSendChat()}
            </div>
          );
        }}
      </GlobalStoreCtx.Consumer>
    );
  };

  render() {
    const { chatroom } = this.state;

    return (
      <div>
        {chatroom ? (
          <GetLayout
            renderDesktop={this.handleDefaultChatDisplay}
            renderMobile={this.handleMobile}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }

  loadSendChat = () => {
    const { onEvent, user, socket } = this.props;
    const { chatroom } = this.state;
    return (
      <SendChat
        onEvent={onEvent}
        user={user}
        socket={socket}
        chatId={chatroom ? chatroom.id : ""}
        server_id={chatroom ? chatroom.host_id : ""}
        onChatFeedback={this.handleChatFeedback}
        setChatTabbed={this.props.setChatTabbed}
        chatTabbed={this.props.chatTabbed}
        isModalShowing={this.props.isModalShowing}
        showMobileNav={this.props.showMobileNav}
        channel={this.props.channel}
      />
    );
  };
}

let previousFeedback = "";
