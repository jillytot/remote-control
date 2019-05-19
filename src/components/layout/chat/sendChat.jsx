import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";

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
    const { user, socket, chatId } = this.props;
    const { sendChat } = this.state.data;
    if (user !== null && chatId !== "") {
      socket.emit(MESSAGE_SENT, {
        username: user.username,
        userId: user.id,
        message: sendChat,
        chatId: chatId
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
      <div className="chat-input">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("sendChat", "The chatbox makes the robot talk!")}
          {this.renderButton("Chat")}
        </form>
      </div>
    );
  }
}
