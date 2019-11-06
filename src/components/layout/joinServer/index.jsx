import React from "react";
import Form from "../../common/form";
import axios from "axios";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import { validateInviteKey, joinServer } from "../../../config/clientSettings";
import "../login/login.css";

//Mode A: Enter a key to join a server
//Mode B: Join server through URL invite link

export default class Join extends Form {
  state = {
    data: {
      invite: ""
    },
    errors: {},
    error: "",
    validated: null,
    redirect: false
  };

  schema = {
    invite: Joi.string()
      .required()
      .min(5)
      .label("Key ID")
  };

  handleValidateInvite = async () => {
    const { invite } = this.state.data;
    console.log("INVITE CHECK: ", invite);
    await axios
      .post(validateInviteKey, {
        invite: invite
      })
      .then(response => {
        console.log(response);
        if (response.data.error) this.setState({ validated: false });
      })
      .catch(error => {
        console.log(error);
      });
    return null;
  };

  setError = error => {
    this.setState({ error: error });
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  doSubmit = async () => {
    const { invite } = this.state.data;
    if (!invite) {
      this.setError("Please enter a valid key.");
      return;
    }
    await this.handleValidateInvite();
    return null;
  };

  render() {
    return (
      <div className="register-form">
        To join a server, enter a valid invite key below:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("invite", "Key ID", "invite")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
