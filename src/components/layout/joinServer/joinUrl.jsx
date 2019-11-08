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

export default class JoinURL extends Form {
  renderServerImage = () => {
    return (
      <div className="server-img-container">
        <img className="server-img" alt="" src={defaultImages.default01} />
      </div>
    );
  };

  handleJoin = () => {
    console.log("BOOM!");
  };

  //TODO: Make this server info card a reusable component
  handleValidResponse = () => {
    const { server, invited_by } = this.props.response_data;
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
    this.handleJoin();
    return null;
  };

  renderLogo = () => {
    return (
      <div className="logo-container">
        <img className="logo" alt="" src={defaultImages.remoLogo} />
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="nav-container">
          <Link to="/"> {this.renderLogo()}</Link>
        </div>
        <div className="register-form make-window">
          {this.handleValidResponse()}
        </div>
      </React.Fragment>
    );
  }
}
