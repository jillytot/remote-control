import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import {
  patreonClientID,
  urlPrefix,
  linkPatreon
} from "../../../config/client/index";
import "./patreon.css";

export default class Patreon extends Component {
  state = {
    code: "",
    path: "",
    params: "",
    status: "fetching data ..."
  };

  componentDidMount() {
    this.handleParse();
  }

  handleParse = () => {
    const { code, state } = queryString.parse(this.props.location.search);
    if (code && state) {
      const getData = state.trim().split(" ");
      console.log(getData);
      this.setState({
        code: code,
        path: getData[0].substr(1),
        params: getData[1],
        status: "Link in progress ... "
      });
    } else {
      this.handleError();
    }
  };

  handleError = () => {
    this.setState({
      status: "There was a problem with this request, please try again later..."
    });
  };

  handleLink = async () => {
    const { path, params, code } = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          linkPatreon,
          {
            code: code,
            grant_type: "authorization_code",
            client_id: patreonClientID,
            client_secret: "",
            redirect_uri: `${urlPrefix}${path}${params}`
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          console.log("Link Patreon Response: ", response.data);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.handleError();
    }
  };

  render() {
    const { status } = this.state;
    return <div className="feedback"> {status} </div>;
  }
}
