import React, { Component } from "react";
import { urlPrefix, patreonClientID } from "../../../config/client";

export default class LinkPatreon extends Component {
  state = {};

  componentDidMount() {
    console.log("Patreon: ", this.props);
  }

  handleRedirect = () => {
    const sendParams = `${window.location.pathname}+${this.props.locationSearch}`;

    return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${patreonClientID}&redirect_uri=${urlPrefix}patreon/&state=${sendParams}`;
  };

  //   handleLink = async () => {
  //     const token = localStorage.getItem("token");
  //     axios
  //       .get("https://www.patreon.com/oauth2/authorize", {
  //         response_type: "code",
  //         client_id:
  //           "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  //         redirect_uri: "https://staging.remo.tv/patreon",
  //         scope: "users pledges-to-me my-campaign",
  //         state: token
  //       })
  //       .then(response => {
  //         console.log("Link Patreon Response: ", response.data);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   };

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
