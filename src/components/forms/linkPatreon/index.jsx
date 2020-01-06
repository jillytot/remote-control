import React, { Component } from "react";
import { urlPrefix, patreonClientID, patreonUrl } from "../../../config/client";
import Confirm from "../../common/confirm/index";

export default class LinkPatreon extends Component {
  state = {
    displayConfirm: false, //Recommend using this conditional to render <Confirm />
    displayPending: false,
    displaySuccess: "",
    displayError: false
  };

  componentDidMount() {
    console.log("Patreon: ", this.props);
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

  handleDisplayRewards = () => {
    const { patreon_id } = this.props;
    if (patreon_id)
      return (
        <div className="info-container">
          <div className="info-key">perks: </div>
          <div className="info-value"> ...soon </div>
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
    //await action to complete
    //this.setState({ displaySuccess: "Success Message" });
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
    this.setState({
      displayConfirm: false,
      displayPending: false,
      displaySuccess: ""
    });
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
