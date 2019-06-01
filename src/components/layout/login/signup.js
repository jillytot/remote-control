import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";
import { apiUrl } from "../../../config/clientSettings";

export default class Signup extends Form {
  state = {
    data: { username: "", password: "", confirm: "", email: "" },
    errors: {},
    isUser: null,
    error: ""
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
      .label("Confirm Password"),
    email: Joi.string()
      .email()
      .required()
      .label("Email")
  };

  async componentDidMount() {
    //Just a test to see my API stuff is working
    await axios
      .get(apiUrl)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

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

    const { data } = this.state;
    await axios
      .post(`${apiUrl}/signup`, {
        username: data.username,
        password: data.password,
        email: data.email
      })
      .then(response => {
        const { handleAuth } = this.props;
        console.log(response);
        localStorage.setItem("token", response.data.token);
        handleAuth(localStorage.getItem("token"));
      })
      .catch(function(error) {
        console.log(error);
      });

    //Call the server
  };

  render() {
    return (
      <div className="register-form">
        Please do not use actual passwords or emails for this build.
        {this.handleSubmitError()}
        <form className="form-block" onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "text")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "password")}
          {this.renderInput("email", "Email", "email")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
