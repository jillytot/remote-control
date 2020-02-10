import React, { Component } from "react";
import axios from "axios";
import { welcome } from "../../../config/client/index";
import Images from "../../../imgs/placeholders";
import InlineLink from "../../common/links/inlineLink";
import "./welcome.scss";

export default class Welcome extends Component {
  state = {
    messageLoaded: false
  };

  handleWelcomeStatus = async () => {
    const token = localStorage.getItem("token");
    await axios
      .post(
        welcome,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        if (res.data.error) console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDisplayModal = () => {
    if (!this.state.messageLoaded) this.setState({ messageLoaded: true });
    this.handleWelcomeStatus();
    return [
      {
        body: <HandleContent {...this.props} />
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    const { displayWelcome } = this.props.user.status;
    const { messageLoaded } = this.state;
    return displayWelcome && !messageLoaded ? (
      this.props.modal(this.handleDisplayModal())
    ) : (
      <React.Fragment />
    );
  }
}

const HandleContent = ({ onCloseModal }) => {
  return (
    <div className="welcome__container">
      <div className="welcome__header">Welcome to Remo.TV</div>
      <div className="welcome__content-container">
        <img
          src={Images.remoSplash}
          className="welcome__splash"
          alt="Remo.TV"
        />
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
          onClick={() => {
            onCloseModal();
          }}
        >
          Continue to Remo
        </button>
      </div>
    </div>
  );
};
