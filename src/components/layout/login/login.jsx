import React from "react";
import { VERIFY_USER } from "../../../services/sockets/events";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";

export default class Login extends Form {
  state = {
    data: { username: "", password: "", confirm: "", email: "" },
    errors: {},
    isUser: null
  };

  schema = {
    username: Joi.string()
      .required()
      .min(4)
      .max(25)
      .alphanum()
      .trim()
      .label("Username"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    confirm: Joi.string()
      .required()
      .equal(Joi.ref("password"))
      .options({
        language: {
          any: {
            allowOnly: "!!Passwords do not match"
          }
        }
      })
      .label("Confirm Password"),
    email: Joi.string()
      .email()
      .required()
      .label("Email")
  };

  // componentDidMount() {
  //   this._isMounted = true;
  // }
  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  setUser = ({ user, isUser }) => {
    // console.log("Is User?: ", isUser);
    if (isUser === true) {
      this.setError("User name taken.");
      this.setState({ isUser: false });
      this.validate();
    } else {
      this.props.setUser(user);
      this.setError("");
    }
  };

  handleFeedback = () => {
    const { isUser } = this.state;
    return isUser === false
      ? "Username taken, please try another."
      : "Username";
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
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", this.handleFeedback())}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "confirm")}
          {this.renderInput("email", "Email", "email")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
