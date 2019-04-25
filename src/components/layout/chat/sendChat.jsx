import Form from "../../common/form";
import React from "react";
import Joi from "joi-browser";

export default class SendChat extends Form {
  state = {
    // data: { username: "", password: "", email: "" },
    data: { sendChat: "" },
    errors: {}
  };

  schema = {
    sendChat: Joi.string()
      .required()
      .min(1)
      .max(180)
      .trim()
      .label("Send Chat")
  };

  doSubmit = () => {
    console.log("Submitted!");
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
