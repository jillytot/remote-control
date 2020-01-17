import React, { Component } from "react";
import DeleteChannel from "../../../forms/deleteChannelForm/index";
import "../../../forms/inlineForms.css";

export default class EditChannelForm extends Component {
  state = { displayUpdate: "", channelDeleted: false };

  handleUpdated = () => {
    this.setState({ displayUpdate: "Channel Settings Updated " });
  };

  handleDeleted = () => {
    this.setState({ channelDeleted: true });
  };

  handleDisplayOptions = () => {
    return (
      <React.Fragment>
        <DeleteChannel
          channel={this.props.channel}
          onUpdated={this.handleUpdated}
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
            <div className="">
              {" "}
              This channel has been deleted, you may close modal to continue{" "}
            </div>
          )}
        </div>
      </div>
    );
  }
}
