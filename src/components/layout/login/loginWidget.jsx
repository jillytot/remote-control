import React, { Component } from "react";
import Login from "./login";
import Signup from "./signup";

export default class LoginWidget extends Component {
  state = {
    display: "signup"
  };

  displayLogin = () => {
    return <Login {...this.props} />;
  };

  displaySignUp = () => {
    return <Signup {...this.props} />;
  };

  handleSelect = () => {
    const { display } = this.state;
    return (
      <div className="select-container">
        <div
          className={
            display === "signup"
              ? "select-option selected-option"
              : "select-option"
          }
          onClick={() => this.handleClick("signup")}
        >
          - SignUp
        </div>
        <div className="spacer">or</div>
        <div
          className={
            display === "login"
              ? "select-option selected-option"
              : "select-option"
          }
          onClick={() => this.handleClick("login")}
        >
          Login -
        </div>
      </div>
    );
  };

  handleClick = e => {
    this.setState({ display: e });
  };

  render() {
    const { display } = this.state;
    return (
      <React.Fragment>
        <div className="widget-container">
          {this.handleSelect()}
          {display === "signup" ? this.displaySignUp() : this.displayLogin()}
        </div>
      </React.Fragment>
    );
  }
}
