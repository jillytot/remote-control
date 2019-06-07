import React, { Component } from "react";

export default class PasswordShowHide extends Component {
  state = {
    hidden: true
  };

  render() {
    return (
      <React.Fragment>
        <input type="text" />
        <button>Show / Hide</button>
      </React.Fragment>
    );
  }
}
