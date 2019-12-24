import React, { Component } from "react";
import { urlPrefix, patreonClientID } from "../../../config/client";

export default class LinkPatreon extends Component {
  state = {};

  componentDidMount() {
    console.log("Patreon: ", this.props);
  }

  handleRedirect = () => {
    const sendParams = `${window.location.pathname}+${this.props.locationSearch}`;

    return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${patreonClientID}&redirect_uri=${urlPrefix}patreon&state=${sendParams}`;
  };

  handleDisplay = () => {
    return (
      <div className="info-container">
        <div className="info-key">patreon: </div>
        <div className="info-value"> {""} </div>{" "}
        <a href={this.handleRedirect()}>
          <div className="info-edit"> link patreon account </div>
        </a>
      </div>
    );
  };

  render() {
    return <React.Fragment>{this.handleDisplay()}</React.Fragment>;
  }
}
