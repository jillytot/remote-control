import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";

export default class Patreon extends Component {
  state = {};

  componentDidMount() {
    console.log(queryString.parse(this.props.location.search));
  }

  render() {
    return <div> Patreon </div>;
  }
}
