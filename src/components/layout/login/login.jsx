import React from "react";
import { VERIFY_USER } from "../../../services/sockets/events";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";

export default class Login extends Form {
  //Leaving placeholders for future verification steps
  state = {
    // data: { username: "", password: "", email: "" },
    data: { username: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .min(3)
      .max(18)
      .alphanum()
      .trim()
      .label("Username")
    // password: Joi.string()
    //   .required()
    //   .min(5)
    //   .label("Password"),
    // email: Joi.string()
    //   .email()
    //   .required()
    //   .label("Email")
  };

  doSubmit = () => {
    console.log("Submitted!");
  };

  setUser = ({ user, isUser }) => {
    isUser ? this.setError("User name taken.") : this.setError("");

    //Currently this function is getting called from Layout
    this.props.setUser(user);
  };

  setError = error => {
    this.setState({ error });
  };

  doSubmit = () => {
    //Call the server
    const { socket } = this.props;
    const { data } = this.state;
    socket.emit(VERIFY_USER, data, this.setUser);
  };

  render() {
    return (
      <div className="register-form">
        {/* <h1>Enter a Username</h1> */}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {/* {this.renderInput("password", "Password", "password")}
          {this.renderInput("email", "Email", "email")} */}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
