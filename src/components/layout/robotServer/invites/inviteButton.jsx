import React, { Component } from "react";
import defaultImages from "../../../../imgs/placeholders";
import MakeInvite from "./makeInviteModal";
import "./invite.css";

export default class InviteButton extends Component {
  state = {};

  handleModal = () => {
    return [
      {
        body: <MakeInvite {...this.props} />
      },
      { header: "" },
      { footer: "" }
    ];
  };

  handleDisplay = () => {
    return (
      <React.Fragment>
        <div
          className="invite-button-container"
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          <img
            className="invite-icon"
            src={defaultImages.inviteUser}
            alt={"img"}
            title={"Invite User"}
          />
          <div className="invite-text"> Invite Users</div>
        </div>
      </React.Fragment>
    );
  };
  render() {
    const { user, server } = this.props;

    return user.id === server.owner_id ? (
      this.handleDisplay()
    ) : (
      <React.Fragment />
    );
  }
}
