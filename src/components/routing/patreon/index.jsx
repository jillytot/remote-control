import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { urlPrefix, linkPatreon } from "../../../config/client/index";
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

  componentDidUpdate(prevState) {
    if (this.state.code !== "" && prevState.code !== this.state.code)
      this.handleLink();
  }

  handleParse = () => {
    const { code, state } = queryString.parse(this.props.location.search);
    if (code && state) {
      const getData = state.trim().split(" ");
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
    console.log("Check Code: ", code);
    const token = localStorage.getItem("token");
    if (token && code !== "") {
      axios
        .post(
          linkPatreon,
          {
            code: code,
            redirect_uri: `${urlPrefix}${path}${params}`
          },
          {
            headers: {
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
