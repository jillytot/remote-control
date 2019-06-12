import React, { Component } from "react";
import Icon from "../../common/icon";
import { ICONS } from "../../../icons/icons";
import Overlay from "../../common/overlay";
import Modal from "react-responsive-modal";
import "../../../styles/common.css";

export default class AddServer extends Component {
  state = {
    open: false
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    console.log("Closing Modal");
    this.setState({ open: false });
  };

  handleModal = () => {
    const { open } = this.state;
    return (
      <Modal
        classNames={{
          overlay: "",
          modal: "modal"
        }}
        open={open}
        onClose={this.onCloseModal}
      >
        <div> Add Server: </div>
      </Modal>
    );
  };

  render() {
    return (
      <div className="display-robot-server-container align-add-server">
        <div className="add-server " onClick={this.onOpenModal}>
          {this.handleModal()}
          <Icon icon={ICONS.PLUS} className="display-robot-server-img" />
        </div>
        <div className="display-robot-server">add server</div>
      </div>
    );
  }
}
