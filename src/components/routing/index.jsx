import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./login";
import ServersPage from "./servers";
import RecoveryPage from "./recoveryPage";
import JoinServerPage from "./joinServerPage";
import TOS from "../layout/frontPage/tos";
import PrivacyPolicy from "../layout/frontPage/privacyPolicy";

export default class IndexRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route component={LoginPage} path="/login" />
          <Route component={RecoveryPage} path="/recovery" />
          <Route component={JoinServerPage} path="/join" />
          <Route component={TOS} path="/tos" />
          <Route component={PrivacyPolicy} path="/privacy-policy" />
          <Route component={ServersPage} path="/" />
        </Switch>
      </Router>
    );
  }
}
