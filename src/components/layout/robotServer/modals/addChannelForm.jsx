import React from "react";
import Form from "../../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { apiUrl, addChannel } from "../../../../config/clientSettings";

export default class AddChannelForm extends Form {
  state = {
    data: { channel_name: "" },
    errors: {}
  };

  schema = {
    channel_name: Joi.string()
      .required()
      .min(4)
      .max(25)
      .alphanum()
      .trim()
      .label("Channel Name")
  };

  async componentDidMount() {
    //Just a test to see my API stuff is working
    console.log(this.props);
    await axios
      .get(apiUrl)
      .then(function(response) {
        console.log("Test Response from Add Channel", response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

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
      .catch(err => {
        console.log("Add Server Error: ", err);
      });

    this.props.onCloseModal();
  };

  render() {
    return (
      <div className="register-form">
        Create a Channel:
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("channel_name", "Channel Name: ", "text")}
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
