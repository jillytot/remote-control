import React, { Component } from "react";
import EditChannelForm from "./editChannelForm";

export default class EditChannel extends Component {
  handleModal = () => {
    const { onCloseModal, channel, server } = this.props;

    return [
      {
        body: (
          <EditChannelForm
            onCloseModal={onCloseModal}
            channel={channel}
            server={server}
          />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  handleBehavior = () => {
    const { server, user } = this.props;
    if (server.owner_id === user.id) {
      return (
        <React.Fragment>
          <div
            className="edit-channel"
            onClick={() => this.props.modal(this.handleModal())}
          >
            ...
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment />;
    }
  };

  render() {
    return <React.Fragment> {this.handleBehavior()}</React.Fragment>;
  }
}
