import React from "react";
import { BrowserRouter as Route, Switch } from "react-router-dom";

import Recovery from "../layout/recovery/recovery";

const RecoveryPage = () => {
  return (
    <Switch>
      <Route
        path="/:name"
        render={props => {
          return <Recovery {...props} />;
        }}
      />
      <Route
        path="/"
        exact
        Component={props => {
          return <ResetPage />;
        }}
      />
    </Switch>
  );
};

export default RecoveryPage;

const ResetPage = () => {
  return <div className="register-form">RESET!</div>;
};
