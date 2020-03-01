import React, { Component } from "react";
import EditServerMenu from "./editServerMenu";

//TODO: Do membership check here. Make sure followed servers always come paired with membership info.
export default class EditServer extends Component {
  handleModal = () => {
    const { onCloseModal, server, user } = this.props;
    return [
      {
        body: (
          <EditServerMenu
            onCloseModal={onCloseModal}
            server={server}
            user={user}
          />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    const { user, server, localStatus } = this.props;

    return (
      <React.Fragment>
        {user.id === server.owner_id ||
        (localStatus && localStatus.member === true) ? (
          <div
            className="server-settings"
            onClick={() => this.props.modal(this.handleModal())}
          >
            {`( settings )`}
          </div>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}
