import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";

export default class Signup extends Form {
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

  async componentDidMount() {
    await axios
      .get("http://localhost:3231/api/")
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

  handleFeedback = () => {};

  setError = error => {
    this.setState({ errors: error });
  };

  doSubmit = async () => {
    const { socket } = this.props;
    const { data } = this.state;
    await axios
      .post("http://localhost:3231/api/signup", {
        username: data.username,
        password: data.password,
        email: data.email
      })
      .then(function(response) {
        console.log(response);
        socket.emit("AUTHENTICATE", { token: response.data.token });
      })
      .catch(function(error) {
        console.log(error);
      });
    //Call the server
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
