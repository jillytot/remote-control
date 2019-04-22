import React from "react";
import { VERIFY_USER } from "../../../services/sockets/events";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";

export default class Login extends Form {
  state = {
    username: "",
    error: ""
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  setUser = ({ user, isUser }) => {
    isUser ? this.setError("User name taken.") : this.setError("");
    this.props.setUser(user);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { socket } = this.props;
    const { username } = this.state;
    socket.emit(VERIFY_USER, username, this.setUser);
    console.log("Username Submitted: ", username);
  };

  handleChange = e => {
    this.setState({ username: e.target.value });
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    const { username, error } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="login-form">
          <input
            placeholder="Login"
            ref={input => {
              this.textInput = input;
            }}
            type="text"
            id="username"
            value={username}
            onChange={this.handleChange}
          />
          <div className="error">{error ? error : null}</div>
        </form>
      </div>
    );
  }
}
