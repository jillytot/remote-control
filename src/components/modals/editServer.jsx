import React, { Component } from "react";
import EditServerMenu from "./editServerMenu";

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
    console.log("Show server settings");
    return (
      <React.Fragment>
        <div
          className="server-settings"
          onClick={() => this.props.modal(this.handleModal())}
        >
          {`( settings )`}
        </div>
      </React.Fragment>
    );
  }
}
