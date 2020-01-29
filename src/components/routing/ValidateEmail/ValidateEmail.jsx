import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { validateEmailWithKey } from "../../../config/client";
import axios from "axios";
import "./validateEmail.scss";

export default class ValidateEmail extends Component {
  state = {
    key_id: "",
    redirect: false,
    status:
      "Requesting email validation from the server, you will be redirected back to Remo.TV shortly..."
  };

  handleValidationWithKey = async () => {
    await axios
      .post(validateEmailWithKey, { key_id: this.state.key_id })
      .then(res => {
        console.log(res.data);
        if (res.data.error) {
          this.setState({ status: res.data.error });
        } else if (res.data.email_validated) {
          this.setState({ redirect: true });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          status:
            "There was an unexpected issue, please try request again later."
        });
      });
  };

  async componentDidMount() {
    console.log(this.props);
    await this.handleGetUrl();
    console.log("Get Key Result: ", this.state.key_id, this.props);
    if (this.state.key_id !== "") this.handleValidationWithKey();
  }

  handleGetUrl = () => {
    const name = this.props.match.params.name;
    const path = this.props.location.pathname;
    const key = path.substr(name.length + 2);
    if (key !== "") {
      this.setState({ key_id: key });
    } else {
      this.setState({ status: "Invalid Key." });
    }

    return null;
  };

  render() {
    const { status } = this.state;
    console.log("From Render: ", this.props.match);
    return this.state.redirect ? (
      <Redirect to={`/?modal=profile`} />
    ) : (
      <div className="validateEmail__response"> {status} </div>
    );
  }
}
