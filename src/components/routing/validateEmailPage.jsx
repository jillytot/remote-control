import React from "react";
import { Route, Switch } from "react-router-dom";
import ValidateEmail from "./ValidateEmail/ValidateEmail";
import "../layout/login/login.css";

const ValidateEmailPage = () => {
  return (
    <Switch>
      <Route
        path="/:name"
        render={props => {
          return <ValidateEmail {...props} />;
        }}
      />
      <Route
        path="/"
        render={props => {
          return <NothingToValidate {...props} />;
        }}
      />
    </Switch>
  );
};

export default ValidateEmailPage;

const NothingToValidate = () => {
  return <div className="register-form"> Nothing to Validate </div>;
};
