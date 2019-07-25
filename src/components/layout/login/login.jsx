import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";
import { apiLogin } from "../../../config/clientSettings";
import { Redirect } from "react-router-dom";

export default class Login extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    isUser: null,
    redirect: false
  };

  async componentDidMount() {
    await axios
      .get(apiLogin)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

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
      .label("Password")
  };

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

  doSubmit = async () => {
    //Call the server
    const { data } = this.state;
    console.log("Login submitted for user: ", data.username);
    await axios
      .post(apiLogin, {
        username: data.username,
        password: data.password
      })
      .then(res => {
        console.log("Login response: ", res);
        localStorage.setItem("token", res.data.token);
        this.setState({ redirect: true });
      })
      .catch(err => {
        console.log("Login Error: ", err);
      });
  };

  render() {
    return this.state.redirect ? (
      <Redirect to="/" />
    ) : (
      <div className="register-form">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "text")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
