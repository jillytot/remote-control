import React, { Component } from "react";
import {
  urlPrefix,
  patreonClientID,
  patreonUrl,
  removePatreon
} from "../../../config/client";
import Confirm from "../../common/confirm/index";
import axios from "axios";

export default class LinkPatreon extends Component {
  state = {
    displayConfirm: false, //Recommend using this conditional to render <Confirm />
    displayPending: false,
    displaySuccess: "",
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

  handleDisplayStatus = () => {
    const { active_rewards } = this.props;
    if (active_rewards.reward_title) {
      return (
        <div className="info-container">
          <div className="info-key">status: </div>
          <div className="info-value"> Active Contributor </div>
        </div>
      );
    }
  };

  handleDisplayRewards = () => {
    const { patreon_id, active_rewards } = this.props;
    const reward = active_rewards.reward_title || "No active rewards found.";
    console.log("Patreon Props: ", this.props);
    if (patreon_id)
      return (
        <div className="info-container">
          <div className="info-key">perks: </div>
          <div className="info-value">{reward} </div>
        </div>
      );
    return <React.Fragment />;
  };

  handleDisplayLink = () => {
    return (
      <a href={this.handleRedirect()}>
        <div className="info-edit"> ( link account ) </div>
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
            displaySuccess: res.data.error,
            displayError: true
          });
          return;
        } else {
          this.setState({ displaySuccess: res.data });
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
      displaySuccess: "Request taking too long, try again later."
    });
  };

  handleDisplayConfirm = () => {
    const {
      displayConfirm,
      displayPending,
      displaySuccess,
      displayError
    } = this.state;
    if (displayConfirm) {
      return (
        <Confirm
          input="removal" //What is the action being confirmed?
          displayConfirm={displayConfirm}
          displayPending={displayPending}
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          onComplete={this.handleComplete}
          displaySuccess={displaySuccess}
          displayError={displayError}
        />
      );
    }
    return <React.Fragment />;
  };

  handleComplete = () => {
    const { onProfileUpdated } = this.props;
    this.setState({
      displayConfirm: false,
      displayPending: false,
      displaySuccess: ""
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
      <div
        className="info-edit"
        onClick={() => {
          this.setState({ displayConfirm: !displayConfirm });
        }}
      >
        ( remove )
      </div>
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
        <div className="info-container">
          <div className="info-key">patreon: </div>
          <div className="info-value"> {this.handleLinked()} </div>{" "}
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
