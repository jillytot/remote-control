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
      .max(180)
      .trim()
      .label("Chat Message")
  };

  doSubmit = () => {
    const { user, socket } = this.props;
    const { sendChat } = this.state.data;
    if (user !== null) {
      socket.emit(MESSAGE_SENT, {
        username: user.name,
        userId: user.id,
        message: sendChat
      });
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
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("sendChat", "The chatbox makes the robot talk!")}
          {this.renderButton("Chat")}
        </form>
      </div>
    );
  }
}
