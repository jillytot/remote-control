import React, { Component } from "react";
import EditButtonsModal from "../../modals/editButtonsModal";
import "./editOptions.css";

export default class EditOptions extends Component {
  state = {
    edit: <div className=""> ... </div>
  };

  componentWillMount() {
    if (this.props.user.id === this.props.server.owner_id) {
      this.setState({ edit: this.handleEditButton() });
    }
  }

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
            channel={this.props.channel}
          />
        )
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    return <React.Fragment>{this.state.edit}</React.Fragment>;
  }
}
