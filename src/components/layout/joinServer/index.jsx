import React from "react";
import Form from "../../common/form";
import axios from "axios";
import Joi from "joi-browser";
import { Link, Redirect } from "react-router-dom";
import { validateInviteKey, joinServer } from "../../../config/clientSettings";
import "./join.css";
import defaultImages from "../../../imgs/placeholders";

//Mode A: Enter a key to join a server
//Mode B: Join server through URL invite link

export default class Join extends Form {
  state = {
    data: {
      invite: ""
    },
    response_data: {},
    errors: {},
    error: "",
    validated: null,
    redirect: false
  };

  schema = {
    invite: Joi.string()
      .required()
      .min(5)
      .label("Key ID")
  };

  renderServerImage = () => {
    return (
      <div className="server-img-container">
        <img className="server-img" alt="" src={defaultImages.default01} />
      </div>
    );
  };

  handleValidateInvite = async () => {
    const { invite } = this.state.data;
    //  console.log("INVITE CHECK: ", invite);
    await axios
      .post(validateInviteKey, {
        invite: invite
      })
      .then(response => {
        if (response.data.error) {
          this.setState({ validated: false });
          this.setError(response.data.error);
          return null;
        }
        this.setState({ response_data: response.data, validated: true });
      })
      .catch(error => {
        console.log(error);
      });
    return null;
  };

  //TODO: Make this server info card a reusable component
  handleValidResponse = () => {
    const { server, invited_by } = this.state.response_data;
    const date = new Date(parseInt(server.created));
    //  console.log(server.created, date);
    return (
      <React.Fragment>
        <div>{invited_by.username} has invited you to join this server. </div>
        <div className="server-info-card">
          {this.renderServerImage()}
          <div className="details-container">
            <div className="details larger">
              <span className="key-name">Server Name: </span>
              {server.server_name}
            </div>
            <div className="details">
              <span className="key-name">Owner: </span>
              {server.owner_name}
            </div>
            <div className="details">
              <span className="key-name">Created: </span> {date.toDateString()}
            </div>
            <div className="details">
              {" "}
              <span className="key-name">Members: </span>
              {server.members}
            </div>
            <div className="details">
              <span className="key-name">Live Devices: </span>
              {server.live_devices.length}
            </div>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          {this.renderButton("Oh GOD YES!")}
        </form>
      </React.Fragment>
    );
  };

  handleJoin = () => {
    console.log("BOOM!");
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
    const { invite } = this.state.data;
    if (!invite) {
      this.setError("Please enter a valid key.");
      return;
    }
    this.state.validated ? this.handleJoin() : this.handleValidateInvite();
    return null;
  };

  handleLoadSubmit = () => {
    return (
      <React.Fragment>
        To join a server, enter a valid invite key below:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("invite", "Key ID", "invite")}
          {this.renderButton("Submit")}
        </form>
      </React.Fragment>
    );
  };

  renderLogo = () => {
    return (
      <div className="logo-container">
        <img className="logo" alt="" src={defaultImages.remoLogo} />
      </div>
    );
  };

  render() {
    const { validated } = this.state;
    return (
      <React.Fragment>
        <div className="nav-container">
          <Link to="/"> {this.renderLogo()}</Link>
        </div>
        <div className="register-form make-window">
          {validated ? this.handleValidResponse() : this.handleLoadSubmit()}
        </div>
      </React.Fragment>
    );
  }
}
