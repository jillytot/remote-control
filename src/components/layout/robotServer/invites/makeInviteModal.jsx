import React, { Component } from "react";
import MakeInviteForm from "./makeInviteForm";

export default class MakeInvite extends Component {
  state = {};

  render() {
    return (
      <div className="make-invite-container">
        Invite Users:
        <MakeInviteForm {...this.props} />
      </div>
    );
  }
}
