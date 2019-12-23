import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
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
      this.setState({
        status:
          "There was a problem with this request, please try again later..."
      });
    }
  };

  render() {
    const { status } = this.state;
    return <div className="feedback"> {status} </div>;
  }
}
