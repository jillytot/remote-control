import React, { Component } from "react";
import axios from "axios";
import { welcome } from "../../../config/client/index";
// import TOS from "../../layout/frontPage/tos";
// import PrivacyPolicy from "../../layout/frontPage/privacyPolicy";
import InlineLink from "../../common/links/inlineLink";
import "./welcome.scss";

export default class Welcome extends Component {
  state = {
    messageLoaded: false
  };

  handleContent = () => {
    return (
      <div className="welcome__container">
        <div className="welcome__header">Welcome to Remo.TV</div>
        <div className="welcome__content-container">
          <div className="welcome__text">
            Thanks for signing up and joining the Remo.TV community.
            <br />
            <br />
            We have sent a validation link to the email address you provided.
            <br />
            For security reasons, your access to Remo may be limited without a
            validated email account.
            <br />
            <br />
            By continuing to Remo, you are agreeing to our{" "}
            <InlineLink link="/tos" text="Terms of Service" /> {` & `}
            <InlineLink link="/privacy-policy" text="Privacy Policy" />.
            <br />
            <br />
          </div>

          <button
            className="welcome__btn"
            onClick={() => this.props.onCloseModal()}
          >
            Continue to Remo
          </button>
        </div>
      </div>
    );
  };

  handleWelcomeStatus = async () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        welcome,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDisplayModal = () => {
    this.setState({ messageLoaded: true });
    this.handleWelcomeStatus();
    return [
      {
        body: this.handleContent()
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    const { displayWelcome } = this.props.user;
    const { messageLoaded } = this.state;
    return !messageLoaded ? (
      this.props.modal(this.handleDisplayModal())
    ) : (
      <React.Fragment />
    );
  }
}
