import React from "react";
import { VERIFY_USER } from "../../../services/sockets/events";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";

export default class Login extends Form {
  state = {
    data: { username: "", password: "", email: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    email: Joi.string()
      .email()
      .required()
      .label("Email")
  };

  doSubmit = () => {
    console.log("Submitted!");
  };

  setUser = ({ user, isUser }) => {
    isUser ? this.setError("User name taken.") : this.setError("");
    this.props.setUser(user);
  };

  setError = error => {
    this.setState({ error });
  };

  doSubmit = () => {
    //Call the server
    console.log("Submitted!");
    const { socket } = this.props;
    const { username } = this.state.data;
    socket.emit(VERIFY_USER, username, this.setUser);
    console.log("Username Submitted: ", username);
  };

  render() {
    return (
      <div>
        <h1>Register Account</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("email", "Email", "email")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}
