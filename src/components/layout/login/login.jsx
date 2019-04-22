import React, { Component } from "react";
import { VERIFY_USER } from "../../../services/sockets/events";
import "../../../styles/common.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: "",
      error: ""
    };
  }

  setUser = ({ user, isUser }) => {
    isUser ? this.setError("User name taken.") : this.setError("");
    this.props.setUser(user);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, this.setUser);
  };

  handleChange = e => {
    this.setState({ nickname: e.target.value });
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    const { nickname, error } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="login-form">
          <input
            placeholder="Login"
            ref={input => {
              this.textInput = input;
            }}
            type="text"
            id="nickname"
            value={nickname}
            onChange={this.handleChange}
          />
          <div className="error">{error ? error : null}</div>
        </form>
      </div>
    );
  }
}
