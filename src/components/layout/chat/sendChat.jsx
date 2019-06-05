import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";
import "./chat.css";

import { MESSAGE_SENT } from "../../../services/sockets/events";

export default class SendChat extends Form {
  state = {
    data: { sendChat: "" },
    errors: {},
    user: {},
    uuid: 0 //used to generate keys for locally generated messages
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
    let keepGoing = true;
    const { user, socket, chatId, server_id, onChatFeedback } = this.props;
    console.log("CHECK USER STATUS TIMEOUT: ", user.status[0].timeout);
    console.log("CHECK USER STATUS: ", user.status[0]);

    if (user.status[0].timeout) {
      keepGoing = false;
      let toUser = "Unable to send chat messages while timed out";
      let feedback = messageBlank;
      feedback.message = toUser;
      feedback.userId = user.id;
      feedback.chat_id = chatId;
      feedback.server_id = server_id;
      feedback.id = this.state.uuid + 1;
      this.setState({ uuid: feedback.id });

      onChatFeedback(feedback);
      console.log(toUser);
    }

    const { sendChat } = this.state.data;
    if (user !== null && chatId !== "" && keepGoing) {
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
    } else {
      console.log("CANNOT SEND CHAT");
    }
    this.setState({ data: { sendChat: "" } });
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

const messageBlank = {
  message: "",
  username: "",
  sender_id: "",
  chat_id: "",
  server_id: "",
  id: "",
  time_stamp: Date.now(),
  displayMessage: true,
  type: "moderation"
};
