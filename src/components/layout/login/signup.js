import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";
import { apiUrl } from "../../../config/clientSettings";
import ReCAPTCHA from "react-google-recaptcha";

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

  recaptchaRef = React.createRef();

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

  handleFeedback = () => {};

  setError = error => {
    this.setState({ errors: error });
  };

  doSubmit = async () => {
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

  handleCaptcha = () => {
    // https://www.npmjs.com/package/react-google-recaptcha
    const recaptchaValue = this.recaptchaRef.current.getValue();
    console.log(recaptchaValue);
  };

  render() {
    return (
      <div className="register-form">
        <div className="alert">
          ... Please do not use real emails or passwords on this build ...
        </div>

        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "confirm")}
          {this.renderInput("email", "Email", "email")}
          <ReCAPTCHA
            sitekey="6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo" // site key will need to change, probably kept private and off stream.
            ref={this.recaptchaRef}
            onChange={this.handleCaptcha} // this parameter is required.
            // theme="dark"   // Did you know captcha has a dark theme?
          />
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}
