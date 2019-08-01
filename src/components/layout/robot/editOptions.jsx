import React, { Component } from "react";
import EditButtonsModal from "../../modals/editButtonsModal";
import "./editOptions.css";

export default class EditOptions extends Component {
  handleEditButton = () => {
    return (
      <div className="options-container">
        <div
          className="button-edit"
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          (edit buttons)
        </div>
      </div>
    );
  };

  handleModal = () => {
    console.log("CLICK!");
    return [
      {
        body: (
          <EditButtonsModal
            modal={this.props.modal}
            onCloseModal={this.props.onCloseModal}
            controls={this.props.controls}
          />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  handleEditAuth = () => {
    if (this.props.user.id === this.props.server.owner_id) {
      console.log("BOOP TEST");
      return this.handleEditButton();
    }
    console.log("BOOP TEST 2");
    return <div className=""> ... </div>;
  };

  render() {
    return <React.Fragment>{this.handleEditAuth()}</React.Fragment>;
  }
}
