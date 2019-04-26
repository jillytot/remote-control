import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";
import { SEND_CHAT } from "../../localEvents";

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
    const { onEvent } = this.props;
    const { sendChat } = this.state.data;
    onEvent(SEND_CHAT, sendChat);
    this.setState({ data: { sendChat: "" } });
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
