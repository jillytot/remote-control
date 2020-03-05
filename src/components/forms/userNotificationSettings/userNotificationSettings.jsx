import React, { Component } from "react";
import Toggle from "../../common/toggle";
import InlineResponse from "../../common/inlineResult/inlineResult";
import InlineItem from "../../styleComponents/inlineItem/inlineItem";

export default class UserNotificationSettings extends Component {
  state = {
    success: "",
    error: "",
    settings: {
      enable_email_notifications: null
    },
    compareSettings: {
      enable_email_notifications: null
    }
  };

  componentDidMount() {
    let { settings } = this.props;
    if (!settings.hasOwnProperty("enable_email_notifications"))
      settings.enable_email_notifications = true;
    this.setState({ settings: settings, compareSettings: settings });
  }

  handleToggle = () => {
    this.setState(state => {
      return {
        settings: {
          ...state.settings,
          enable_email_notifications: !state.settings.enable_email_notifications
        }
      };
    });
  };

  handleSubmitResponse = () => {
    const { error, success } = this.state;
    if (error !== "")
      return (
        <InlineResponse message={error} onClose={this.handleCloseResponse} />
      );
    if (success !== "")
      return (
        <InlineResponse
          message={success}
          type="success"
          onClose={this.handleCloseResponse}
        />
      );

    return null;
  };

  handleContent = () => {
    const { email_verified } = this.props.status;

    if (!email_verified) return "verified email required.";
    return (
      <Toggle
        toggle={this.state.settings.enable_email_notifications}
        label=""
        onClick={this.handleToggle}
        critical={false}
        inline
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        <InlineItem
          label="enable email notifications:"
          item={this.handleContent()}
        />
        {this.handleSubmitResponse()}
      </React.Fragment>
    );
  }
}
