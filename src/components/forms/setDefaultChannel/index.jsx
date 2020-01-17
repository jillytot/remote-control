import React, { Component } from "react";
import "../inlineForms.css";

export default class SetDefaultChannel extends Component {
  state = {
    isDefault: null
  };

  componentDidMount() {
    this.handleCheckDefault();
  }

  handleCheckDefault = () => {
    const { server, channel } = this.props;
    if (server.settings.default_channel === channel.id)
      this.setState({ isDefault: true });
    return null;
  };

  handleDisplay = () => {
    return (
      <div className="inline-container">
        <div className="inline-label"> Make this my default channel: </div>
        <div className="inline-info"></div>
        {this.state.isDefault ? (
          <div className="inline-no-action"> Channel is Default </div>
        ) : (
          <div className="inline-action"> Set as Default </div>
        )}
      </div>
    );
  };

  render() {
    return this.handleDisplay();
  }
}
