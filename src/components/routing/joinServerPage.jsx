import React from "react";
//apparently removing "Router" from import breaks things, even though it's unused
import { Route, Switch } from "react-router-dom";
import "../layout/login/login.css";
// import Recovery from "../layout/recovery/recovery";
import Join from "../layout/joinServer/index";

const JoinServerPage = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route
          path="/"
          render={props => {
            return <Join {...props} />;
          }}
        />
      </Switch>
    </React.Fragment>
  );
};

export default JoinServerPage;
