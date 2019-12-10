import React, { Component } from "react";
import EditServerMenu from "./editServerForm";

export default class EditServer extends Component {
  handleModal = () => {
    const { onCloseModal, server, user } = this.props;

    return [
      [
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
      ]
    ];
  };

  handleBehavior = () => {
    const { server, user } = this.props;
    if (server.owner_id === user.id) {
      return (
        <React.Fragment>
          <div
            className="server-settings"
            onClick={() => this.props.modal(this.handleModal())}
          >
            {" "}
            {`(edit)`}
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
