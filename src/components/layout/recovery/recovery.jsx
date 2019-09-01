import React from "react";
import Form from "../../common/form";
import axios from "axios";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import "../login/login.css";

export default class Recovery extends Form {
  state = {
    data: { password: "", confirm: "" },
    errors: {},
    error: "",
    redirect: false
  };

  schema = {
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    confirm: Joi.string()
      .required()
      .label("Confirm Password")
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
    const { password, confirm } = this.state.data;
    if (password !== confirm) {
      this.setState({ error: "Passwords do not match!" });
      return;
    }

    return null;
  };

  render() {
    return this.state.redirect ? (
      <Redirect to="/"></Redirect>
    ) : (
      <div className="register-form">
        Change Password:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "password")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
