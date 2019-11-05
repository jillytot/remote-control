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
      key: ""
    },
    errors: {},
    error: "",
    validated: null,
    redirect: false
  };

  schema = {
    key: Joi.string()
      .required()
      .min(5)
      .label("Key ID")
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
    const { key } = this.state.data;
    if (key === "") this.setState({ error: "Please enter a valid invite key" });
    return null;
  };

  render() {
    return (
      <div className="register-form">
        To join a server, enter a valid invite key below:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("key", "Key ID", "key")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
