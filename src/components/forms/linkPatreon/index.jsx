import React, { Component } from "react";
import { urlPrefix, patreonClientID, patreonUrl } from "../../../config/client";

export default class LinkPatreon extends Component {
  state = {
    linked: ""
  };

  componentDidMount() {
    console.log("Patreon: ", this.props);
  }

  handleRedirect = () => {
    const sendParams = `${window.location.pathname}+${this.props.locationSearch}`;

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
          <a href={this.handleRedirect()}>
            <div className="info-edit"> ( link account ) </div>
          </a>
        </div>
        {this.handleDisplayRewards()}
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.handleDisplay()}</React.Fragment>;
  }
}
