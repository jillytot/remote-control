import React from "react";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./login.css";
import axios from "axios";
import { apiUrl, reCaptchaSiteKey } from "../../../config/client";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from "react-router-dom";

export default class Signup extends Form {
  state = {
    data: { username: "", password: "", confirm: "", email: "" },
    errors: {},
    isUser: null,
    error: "",
    captcha: "",
    redirect: false,
    redirectURL: "/",
    submitText: "Submit"
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

    this.setRedirect();
  }

  setRedirect = () => {
    if (this.props.redirectURL) {
      this.setState({ redirectURL: this.props.redirectURL });
    }

    if (this.props.submitText) {
      this.setState({ submitText: this.props.submitText });
    }
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

    const { data, captcha } = this.state;
    await axios
      .post(`${apiUrl}/signup`, {
        username: data.username,
        password: data.password,
        email: data.email,
        response: captcha
      })
      .then(response => {
        console.log(response.data);
        if (response.data.error) {
          // console.log(response.data.error);
          this.setState({ error: response.data.error });
        }

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          this.setState({ redirect: true });
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    //Call the server
  };

  handleCaptcha = async () => {
    this.setState({
      captcha: this.recaptchaRef.current.getValue()
    });
  };

  render() {
    const { redirectURL, submitText } = this.state;
    return this.state.redirect ? (
      <Redirect to={redirectURL}></Redirect>
    ) : (
      <div className="register-form intro ">
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "text")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "password")}
          {this.renderInput("email", "Email", "email")}
          <ReCAPTCHA
            sitekey={reCaptchaSiteKey}
            ref={this.recaptchaRef}
            onChange={this.handleCaptcha} // this parameter is required.
            //theme="dark" // Did you know captcha has a dark theme?
          />
          {this.renderButton(submitText)}
        </form>
      </div>
    );
  }
}
