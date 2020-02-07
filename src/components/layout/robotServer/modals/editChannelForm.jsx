import React, { Component } from "react";
import DeleteChannelForm from "../../../forms/deleteChannelForm/deleteChannelForm";
import DefaultChannel from "../../../forms/defaultChannel/index";
import RenameChannel from "../../../forms/renameChannel/renameChannel";
import "../../../forms/inlineForms.css";

export default class EditChannelForm extends Component {
  state = { displayUpdate: "", channelDeleted: false, name: "" };

  handleDeleted = () => {
    this.setState({ channelDeleted: true });
  };

  componentDidMount() {
    this.setState({ name: this.props.channel.name });
  }

  handleDisplayOptions = () => {
    return (
      <React.Fragment>
        <RenameChannel
          channel={this.props.channel}
          displayName={this.state.name}
          server={this.props.server}
          onChange={e => this.handleNameChange(e)}
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

  handleNameChange = name => {
    this.setState({ name: name });
  };

  render() {
    const { channelDeleted, displayUpdate } = this.state;

    return (
      <div className="modal">
        {`# ${this.state.name}:`}
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
