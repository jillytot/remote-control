import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";
import "./chat.css";
import { MESSAGE_SENT } from "../../../events/definitions";
import { defaultRate } from "../../../config/clientSettings";
import uuidv4 from "uuid/v4";

export default class SendChat extends Form {
  state = {
    data: { sendChat: "" },
    errors: {},
    user: {},
    //uuid: 0, //used to generate keys for locally generated messages
    coolDown: false,
    indicator: false
  };

  componentDidMount() {
    //set the rate limit from global vars
  }

  startTimer = () => {
    if (!this.state.coolDown) {
      this.setState({ coolDown: true });
      this.timer = setTimeout(() => this.stopTimer(), defaultRate);
    }
  };

  stopTimer = () => {
    clearTimeout(this.timer);
    this.setState({ coolDown: false });
  };

  schema = {
    sendChat: Joi.string()
      .min(1)
      .max(512)
      .trim()
      .label("Chat Message")
  };

  doSubmit = () => {
    let keepGoing = true;
    const { user, socket, chatId, server_id, onChatFeedback } = this.props;
    // console.log("CHECK USER STATUS TIMEOUT: ", user.status.timeout);
    // console.log("CHECK USER STATUS: ", user.status);

    if (user.status && user.status.timeout) {
      keepGoing = false;
      const messageBlank = {
        time_stamp: Date.now(),
        displayMessage: true,
        type: "moderation"
      };
      let toUser = "Unable to send chat messages while timed out";
      let feedback = messageBlank;
      feedback.message = toUser;
      feedback.userId = user.id;
      feedback.chat_id = chatId;
      feedback.server_id = server_id;
      feedback.id = uuidv4();

      onChatFeedback(feedback);
      console.log(toUser);
    }

    if (this.state.coolDown) {
      keepGoing = false;
      let toUser = `You are sending messages too fast, you must wait at least ${defaultRate /
        1000} seconds before you can send a new message`;
      const messageBlank = {
        time_stamp: Date.now(),
        displayMessage: true,
        type: "moderation"
      };

      let feedback = messageBlank;
      feedback.message = toUser;
      feedback.userId = user.id;
      feedback.chat_id = chatId;
      feedback.server_id = server_id;
      feedback.id = uuidv4();

      onChatFeedback(feedback);
      console.log(toUser);
      console.log(feedback.id);
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

      this.startTimer();
    } else {
      console.log("CANNOT SEND CHAT");
    }

    if (this.state.coolDown) {
      return;
    }
    this.setState({ data: { sendChat: "" } });
    //Set Rate Limit Timer
    //Don't clear the chat unless the message can be sent
  };

  setError = error => {
    this.setState({ error });
  };

  handleIndicator = () => {
    if (this.state.indicator) {
      return "indicator indicator-active";
    } else {
      return "indicator";
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="send-chat-options">
          {" "}
          <div className={this.handleIndicator()} />
          control{" "}
        </div>
        <div className="send-chat-container">
          <form onSubmit={this.handleSubmit}>
            <div className="input-field-container">
              {this.renderChatInput("sendChat", "", "chat")}
              <div className="send-chat-btn">
                {this.renderButton("Chat", "chat", "chat")}
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
