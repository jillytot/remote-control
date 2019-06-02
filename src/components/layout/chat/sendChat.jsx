import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";
import "./chat.css";

import { MESSAGE_SENT } from "../../../services/sockets/events";

export default class SendChat extends Form {
  state = {
    data: { sendChat: "" },
    errors: {}
  };

  schema = {
    sendChat: Joi.string()
      .required()
      .min(1)
      .max(512)
      .trim()
      .label("Chat Message")
  };

  doSubmit = () => {
    const { user, socket, chatId, server_id } = this.props;
    const { sendChat } = this.state.data;
    if (user !== null && chatId !== "") {
      socket.emit(MESSAGE_SENT, {
        username: user.username,
        userId: user.id,
        message: sendChat,
        chatId: chatId,
        server_id: server_id
      });
      console.log(
        `SEND TO CHAT, user: ${user.username} userId ${
          user.id
        } message ${sendChat} chatId ${chatId}`
      );
      this.setState({ data: { sendChat: "" } });
    } else {
      console.log("Userlogout Error");
    }
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    return (
      <div className="send-chat-container">
        <form onSubmit={this.handleSubmit}>
          <div className="input-field-container">
            {this.renderInput("sendChat", "", "chat")}
          </div>
          <div className="send-chat-btn"> {this.renderButton("Chat")}</div>
        </form>
      </div>
    );
  }
}
