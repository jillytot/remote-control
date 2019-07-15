import React, { Component } from "react";
import Login from "../layout/login/login";
import Signup from "../layout/login/signup";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Signup />
        ... or login ...
        <Login />
      </React.Fragment>
    );
  }
}
