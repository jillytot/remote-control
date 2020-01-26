import React, { Component } from "react";
import {
  urlPrefix,
  patreonClientID,
  patreonUrl,
  removePatreon
} from "../../../config/client";
import Confirm from "../../common/Confirm/Confirm";
import Rewards from "./rewards";
import axios from "axios";
import "./LinkPatreon.scss";

export default class LinkPatreon extends Component {
  state = {
    displayConfirm: false, //Recommend using this conditional to render <Confirm />
    displayPending: false,
    displayResult: "",
    displayError: false
  };

  componentDidMount() {
    this.handleParams();
  }

  handleParams = () => {
    const sendParams = `${window.location.pathname}+${this.props.locationSearch}`;
    return sendParams;
  };

  handleRedirect = () => {
    const sendParams = this.handleParams();
    return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${patreonClientID}&redirect_uri=${urlPrefix}patreon&state=${sendParams}`;
  };

  handleLinked = () => {
    const { patreon_id } = this.props;
    if (patreon_id) {
      return <div className="remo-green"> {`verified: ${patreon_id}`} </div>;
    }
  };

  //
  handleDisplayRewards = () => {
    const { patreon_id, active_rewards } = this.props;
    if (patreon_id) {
      return <Rewards {...active_rewards} />;
    }
    return <React.Fragment />;
  };

  handleDisplayLink = () => {
    return (
      <a href={this.handleRedirect()}>
        <button className="LinkPatreon__link"> ( link account ) </button>
      </a>
    );
  };

  handleConfirm = async () => {
    this.setState({ displayPending: true });
    const token = localStorage.getItem("token");
    await axios
      .post(
        removePatreon,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        if (res.data.error) {
          this.setState({
            displayResult: res.data.error,
            displayError: true
          });
          return;
        } else {
          this.setState({ displayResult: res.data });
          return;
        }
      })
      .catch(err => {
        console.log("REMOVE PATREON LINK ERROR: ", err);
        // setTimeout(this.setTimeout, 600); //retry
      });
  };

  handleTimeout = () => {
    this.setState({
      displayConfirm: false,
      displayPending: false,
      displayResult: "Request taking too long, try again later."
    });
  };

  handleDisplayConfirm = () => {
    const {
      displayConfirm,
      displayPending,
      displayResult,
      displayError
    } = this.state;
    if (displayConfirm) {
      return (
        <div className="LinkPatreon__confirm-container">
          <Confirm
            confirmText="removal" //What is the action being confirmed?
            displayConfirm={displayConfirm}
            displayPending={displayPending}
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
            onComplete={this.handleComplete}
            displayResult={displayResult}
            displayError={displayError}
          />
        </div>
      );
    }
    return <React.Fragment />;
  };

  handleComplete = () => {
    const { onProfileUpdated } = this.props;
    this.setState({
      displayConfirm: false,
      displayPending: false,
      displayResult: ""
    });

    onProfileUpdated(); //Trigger user profile to get updated data.
  };

  handleCancel = () => {
    this.setState({
      displayConfirm: false,
      displayPending: false
    });
  };

  handleDisplayRemoveLink = () => {
    const { displayConfirm } = this.state;
    return (
      <button
        className="LinkPatreon__remove"
        onClick={() => {
          this.setState({ displayConfirm: !displayConfirm });
        }}
      >
        ( remove )
      </button>
    );
  };

  handleActions = () => {
    const { patreon_id } = this.props;
    if (patreon_id) return this.handleDisplayRemoveLink();
    return this.handleDisplayLink();
  };

  handleDisplay = () => {
    return (
      <React.Fragment>
        <a
          href={patreonUrl}
          onClick={e => {
            e.preventDefault();
            window.open(patreonUrl, "_blank");
          }}
        >
          <div className="info-header patreon">
            Support Remo on Patreon & get perks!
          </div>{" "}
        </a>
        <div className="LinkPatreon__container">
          <div className="LinkPatreon__key">patreon: </div>
          <div className="LinkPatreon__value"> {this.handleLinked()} </div>{" "}
          {this.handleActions()}
        </div>
        {this.handleDisplayConfirm()}
        {this.handleDisplayRewards()}
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.handleDisplay()}</React.Fragment>;
  }
}
