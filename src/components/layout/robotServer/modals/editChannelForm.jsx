import React, { Component } from "react";
import { DeleteChannelForm } from "../../../forms/DeleteChannelForm";
import DefaultChannel from "../../../forms/defaultChannel/index";
import "../../../forms/inlineForms.css";

export default class EditChannelForm extends Component {
  state = { displayUpdate: "", channelDeleted: false };

  handleDeleted = () => {
    this.setState({ channelDeleted: true });
  };

  handleDisplayOptions = () => {
    const { displayUpdate } = this.state;
    console.log("Channel Modal Props: ", this.props);
    return (
      <React.Fragment>
        {displayUpdate !== "" ? (
          <div className="inline-label">{this.state.displayUpdate}</div>
        ) : (
          <React.Fragment />
        )}
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

  render() {
    const { channelDeleted } = this.state;
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
      </div>
    );
  }
}
