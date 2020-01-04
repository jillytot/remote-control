import React, { Component } from "react";
import { urlPrefix, patreonClientID, patreonUrl } from "../../../config/client";
import Confirm from "../../common/confirm/index";

export default class LinkPatreon extends Component {
  state = {
    displayConfirm: false,
    displayPending: false
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

  handleConfirm = () => {
    console.log("CONFIRMED!");
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
    const { displayConfirm, displayPending } = this.state;
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
        <Confirm
          input="removal"
          displayConfirm={displayConfirm}
          displayPending={displayPending}
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
        />
        {this.handleDisplayRewards()}
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.handleDisplay()}</React.Fragment>;
  }
}
