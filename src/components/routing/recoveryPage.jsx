import React from "react";
import { Route, Switch } from "react-router-dom";
import "../layout/login/login.css";
import Recovery from "../layout/recovery/recovery";

const RecoveryPage = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route
          path="/:name"
          render={props => {
            return <Recovery {...props} />;
          }}
        />
        <Route
          path="/"
          render={props => {
            return <ResetPage {...props} />;
          }}
        />
      </Switch>
    </React.Fragment>
  );
};

export default RecoveryPage;

const ResetPage = () => {
  return <div className="register-form">RESET!</div>;
};
