import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
      <Route path="/" render={props => <Recovery />} />
    </Switch>
  );
};

export default RecoveryPage;
