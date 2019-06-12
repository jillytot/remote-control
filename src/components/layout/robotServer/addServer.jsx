import React, { Component } from "react";
import Icon from "../../common/icon";
import { ICONS } from "../../../icons/icons";
import "../../../styles/common.css";
import "../../common/overlay.css";

export default class AddServer extends Component {
  handleModal = () => {
    return [{ body: "BOOP" }, { header: "Modal Header" }];
  };

  render() {
    return (
      <div className="display-robot-server-container align-add-server">
        <div
          className="add-server "
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          <Icon icon={ICONS.PLUS} className="display-robot-server-img" />
        </div>
        <div className="display-robot-server">add server</div>
      </div>
    );
  }
}
