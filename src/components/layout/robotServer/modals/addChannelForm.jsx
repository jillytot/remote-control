import React from "react";
import Form from "../../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { addChannel } from "../../../../config/client";

export default class AddChannelForm extends Form {
  state = {
    data: { channel_name: "" },
    errors: {},
    error: ""
  };

  schema = {
    channel_name: Joi.string()
      .required()
      .min(3)
      .max(18)
      .regex(/^[a-zA-Z0-9_]*$/)
      .trim()
      .label("Channel Name")
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  doSubmit = async () => {
    const { channel_name } = this.state.data;
    const { server } = this.props;
    const token = localStorage.getItem("token");
    console.log("SUBMITTED: ", channel_name, addChannel);

    await axios
      .post(
        addChannel,
        {
          server_id: server.server_id,
          channel_name: channel_name
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        if (response.data.error) {
          this.setState({ error: response.data.error });
        } else {
          this.setState({ error: "" });
        }
      })
      .catch(err => {
        console.log("Add Server Error: ", err);
      });

    if (this.state.error === "") this.props.onCloseModal();
  };

  render() {
    return (
      <div className="modal">
        Create a Channel:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("channel_name", "Channel Name: ", "text")}
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
