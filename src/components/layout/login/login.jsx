import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";
import { apiLogin } from "../../../config/client";
import { Redirect } from "react-router-dom";

export default class Login extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    isUser: null,
    redirect: false,
    error: ""
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
    if (isUser === true) {
      this.setError("User name taken.");
      this.setState({ isUser: false });
      this.validate();
    } else {
      this.props.setUser(user);
      this.setError("");
    }
  };

  setError = error => {
    console.log(error);
    this.setState({ error: error });
  };

  setErrors = errors => {
    console.log(errors);
    this.setState({ errors: errors });
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
        if (res.data.error) {
          console.log(res.data.error);
          this.setState({ error: res.data.error });
        }
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          this.setState({ redirect: true });
        }
      })
      .catch(err => {
        console.log("Login Error: ", err);
      });
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  render() {
    return this.state.redirect ? (
      <Redirect to="/" />
    ) : (
      <div className="register-form intro">
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "text")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
