import React, { Component } from "react";
import { requestEmailValidation } from "../../../config/client/index";
import axios from "axios";
import "./verifyEmail.scss";

export default class VerifyEmail extends Component {
  state = {
    status: "No.",
    error: false
  };

  componentDidMount() {
    const { email_verified } = this.props;
    if (email_verified) {
      this.setState({ status: email_verified });
    }
  }

  handleVerify = async () => {
    console.log("verify");
    const token = localStorage.getItem("token");
    await axios
      .post(
        requestEmailValidation,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log("Verify Email Response: ", response);
        if (response.data.error) {
          this.setState({ status: response.data.error, error: true });
        } else {
          this.setState({ error: false, status: response.data.result });
        }
      });
  };

  render() {
    const { email_verified } = this.props;
    const { status } = this.state;
    return (
      <div className="VerifyEmail__container">
        <div className="VerifyEmail__key"> email verified: </div>
        <div className="VerifyEmail__value"> {status} </div>
        <button
          className="VerifyEmail__link"
          onClick={() => this.handleVerify()}
        >
          {`( send verification email )`}
        </button>
      </div>
    );
  }
}
