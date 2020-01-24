import React, { Component } from "react";
import EditServerForm from "./editServerForm";
import EditInvites from "./editInvites";

export default class EditServerMenu extends Component {
  state = {
    current: "settings"
  };

  render() {
    const { current } = this.state;
    return (
      <React.Fragment>
        {current === "settings" ? (
          <EditServerForm {...this.props} />
        ) : (
          <EditInvites {...this.props} />
        )}
      </React.Fragment>
    );
  }
}
