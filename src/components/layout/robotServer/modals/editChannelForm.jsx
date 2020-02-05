import React, { Component } from "react";
import DeleteChannelForm from "../../../forms/deleteChannelForm/deleteChannelForm";
import DefaultChannel from "../../../forms/defaultChannel/index";
import RenameChannel from "../../../forms/renameChannel/renameChannel";
import "../../../forms/inlineForms.css";

export default class EditChannelForm extends Component {
  state = { displayUpdate: "", channelDeleted: false };

  handleDeleted = () => {
    this.setState({ channelDeleted: true });
  };

  handleDisplayOptions = () => {
    return (
      <React.Fragment>
        <RenameChannel
          channel={this.props.channel}
          server={this.props.server}
          onUpdated={e => this.handleUpdated(e)}
        />

        <DefaultChannel
          channel={this.props.channel}
          server={this.props.server}
        />
        <DeleteChannelForm
          channel={this.props.channel}
          onDeleted={this.handleDeleted}
        />
      </React.Fragment>
    );
  };

  handleUpdated = update => {
    this.setState({ displayUpdate: update });
  };

  render() {
    const { channelDeleted, displayUpdate } = this.state;
    return (
      <div className="modal">
        {`# ${this.props.channel.name}:`}
        <div className="inline-group">
          {!channelDeleted ? (
            this.handleDisplayOptions()
          ) : (
            <div className="inline-label">
              This channel has been deleted, you may close modal to continue{" "}
            </div>
          )}
        </div>
        {displayUpdate !== "" ? (
          <div className="display-update">{this.state.displayUpdate}</div>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}
