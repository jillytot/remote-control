import React from "react";
import Form from "../../common/form";
import axios from "axios";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import { validateResetKey } from "../../../config/clientSettings";
import "../login/login.css";

export default class Recovery extends Form {
  state = {
    data: { password: "", confirm: "" },
    errors: {},
    error: "",
    redirect: false,
    key: null,
    validated: null
  };

  async componentDidMount() {
    await this.handleGetUrl(); //get url
    await this.handleValidateKey();
    //check if url is a valid key
    //if no, then return invalid page
    //else allow password reset
    console.log(this.state.key);
  }

  handleValidateKey = async () => {
    await axios
      .post(validateResetKey, {
        key_id: this.state.key
      })
      .then(response => {
        console.log(response);
        if (response.data.error) this.setState({ validated: false });
        if (response.data.key_id) this.setState({ validated: true });
      })
      .catch(err => {
        console.log(err);
      });

    return null;
  };

  handleGetUrl = () => {
    const name = this.props.match.params.name;
    const path = this.props.location.pathname;
    const key = path.substr(name.length + 2);
    if (key !== "") this.setState({ key: key });
    return key;
  };

  schema = {
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    confirm: Joi.string()
      .required()
      .label("Confirm Password")
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

    return null;
  };

  handleValidKey = () => {
    return (
      <div className="register-form">
        Change Password:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("confirm", "Confirm Password", "password")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  };

  handleInvalidKey = () => {
    return (
      <div className="register-form">
        This key is not valid, either it doesn't exist, or it could have
        expired. Please request a new password reset
      </div>
    );
  };

  render() {
    console.log(this.props);
    return this.state.redirect ? (
      <Redirect to="/"></Redirect>
    ) : this.state.validated ? (
      this.handleValidKey()
    ) : (
      this.handleInvalidKey()
    );
  }
}
