import React from "react";
import Form from "../../common/form";
import axios from "axios";
import Joi from "joi-browser";
import { Link, Redirect } from "react-router-dom";
import { validateInviteKey, joinServer } from "../../../config/client";
import "./join.css";
import defaultImages from "../../../imgs/placeholders";
import LoginWidget from "../login/loginWidget";
import ServerCard from "../../common/serverCard";

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
    redirect: false,
    redirectURL: "/"
  };

  schema = {
    invite: Joi.string()
      .required()
      .min(5)
      .label("Key ID")
  };

  componentDidMount() {
    this.handleJoinURL();
  }

  handleJoinURL = () => {
    const path = this.props.location.pathname;
    const invite = path.substr(6);
    console.log("Get Key from URL: ", invite);
    if (invite) {
      this.setState({ data: { invite: invite } });
      this.handleValidateInvite(invite);
    }
    return null;
  };

  handleValidateInvite = async url => {
    let invite = "";
    if (url && !this.state.error) {
      invite = url;
    } else {
      invite = this.state.data.invite;
    }
    console.log("INVITE CHECK: ", invite, this.state);
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

  handleJoin = async () => {
    console.log("Joining Server");
    const { validated } = this.state;
    const { server } = this.state.response_data;
    const { invite } = this.state.data;
    const token = localStorage.getItem("token");
    if (token && validated) {
      axios
        .post(
          joinServer,
          {
            server_id: server.server_id,
            join: invite
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then(result => {
          if (result.data.status.member) {
            this.setState({
              redirect: true,
              redirectURL: `/${server.server_name}/${server.default_channel}`
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("PLEASE SIGN UP FOR AN ACCOUNT");
    }
  };

  //TODO: Make this server info card a reusable component
  handleValidResponse = () => {
    const { server, invited_by } = this.state.response_data;
    const token = localStorage.getItem("token");
    console.log("Logging Props: ", this.props);

    //  console.log(server.created, date);
    return (
      <React.Fragment>
        <div>{invited_by.username} has invited you to join this server. </div>
        <div className="join-container">
          <ServerCard
            server_name={server.server_name}
            owner_name={server.owner_name}
            members={server.members}
            live_devices={server.live_devices}
            created={server.created}
          />
          <form onSubmit={this.handleSubmit}>
            {token
              ? this.renderButton("Join this server")
              : this.handleSignUp()}
          </form>
        </div>
      </React.Fragment>
    );
  };

  handleSignUp = () => {
    const path = this.props.location.pathname;
    return (
      <React.Fragment>
        <div className="info-text">
          Please sign up or log in to join this server:
        </div>
        <LoginWidget redirectURL={path} submitText="Continue" />
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
    return this.state.redirect ? (
      <Redirect to={this.state.redirectURL}></Redirect>
    ) : (
      <React.Fragment>
        <div className="nav-container">
          <Link to="/"> {this.renderLogo()}</Link>
        </div>
        <div className="invite-card make-window">
          {validated ? this.handleValidResponse() : this.handleLoadSubmit()}
        </div>
      </React.Fragment>
    );
  }
}
