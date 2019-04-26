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

  setUser = ({ user, isUser }) => {
    console.log("Is User?: ", isUser);
    if (isUser === true) {
      this.setError("User name taken.");
      this.validate();
    } else {
      this.props.setUser(user);
      this.setError("");
    }
  };

  setError = error => {
    this.setState({ errors: error });
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
