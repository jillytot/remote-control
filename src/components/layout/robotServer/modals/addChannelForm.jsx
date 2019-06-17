import React from "react";
import Form from "../../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { apiUrl } from "../../../../config/clientSettings";

export default class AddChannelForm extends Form {
  state = {
    data: { channe_name: "" },
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
    console.log("SUBMITTED: ", channel_name);
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
