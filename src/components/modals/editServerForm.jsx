import React from "react";
import Form from "../common/form";
import Toggle from "../common/toggle";
import axios from "axios";
import { updateSettings } from "../../config/client";

export default class EditServerForm extends Form {
  state = {
    data: {},
    errors: {},
    settings: {
      unlist: null,
      private: null,
      phonetic_filter: null,
      announce_followers_in_chat: null
    },
    compareSettings: {
      unlist: null,
      private: null,
      phonetic_filter: null,
      announce_followers_in_chat: null
    },
    error: ""
  };
  schema = {};

  componentDidMount() {
    let { settings } = this.props.server;

    //default to true if no settings for this property exists
    if (!settings.hasOwnProperty("announce_followers_in_chat"))
      settings.announce_followers_in_chat = true;

    this.setState({
      settings: settings,
      compareSettings: settings
    });
  }

  handleUnlistToggle = () => {
    let { settings } = this.state;
    // console.log("CHANGE SETTINGS BEFORE: ", settings);
    settings.unlist = !settings.unlist;
    this.setState({ settings: settings });
    // console.log("CHANGE SETTINGS AFTER: ", settings);
  };

  handlePrivateToggle = () => {
    let { settings } = this.state;
    // console.log("CHANGE SETTINGS BEFORE: ", settings);
    settings.private = !settings.private;
    this.setState({ settings: settings });
    // console.log("CHANGE SETTINGS AFTER: ", settings);
  };

  handlePhoneticFilterToggle = () => {
    let { settings } = this.state;
    // console.log("CHANGE SETTINGS BEFORE: ", settings);
    settings.phonetic_filter = !settings.phonetic_filter;
    this.setState({ settings: settings });
    // console.log("CHANGE SETTINGS AFTER: ", settings);
  };

  handleAnnouceFollowersInChat = () => {
    let { settings } = this.state;
    // console.log("CHANGE SETTINGS BEFORE: ", settings);
    settings.announce_followers_in_chat = !settings.announce_followers_in_chat;
    this.setState({ settings: settings });
  };

  settingsObject = () => {
    console.log(this.props.server.server_id);
    return {
      server: {
        server_id: this.props.server.server_id,
        settings: {
          unlist: this.state.settings.unlist,
          private: this.state.settings.private,
          phonetic_filter: this.state.settings.phonetic_filter,
          announce_followers_in_chat: this.state.settings
            .announce_followers_in_chat
        }
      }
    };
  };

  handleUpdateSettings = async token => {
    //  if (this.state.settings.unlist !== this.state.compareSettings.unlist) {
    console.log("Ding");
    await axios
      .post(updateSettings, this.settingsObject(), {
        headers: { authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("SET LISTING RESPONSE: ", response);
      })
      .catch(err => {
        console.log(err);
      });
  };

  doSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("SUBMITTED: ", this.state.settings);
    await this.handleUpdateSettings(token);
    this.props.onCloseModal();
  };

  render() {
    return (
      <div className="modal">
        Server Settings:{" "}
        <span className="register-form-emphasis">
          {this.props.server.server_name}
        </span>
        <br />
        <form onSubmit={this.handleSubmit}>
          Make Server Unlisted:
          <div className="toggle-group">
            <span className="info">
              Your server will be unlisted from the public directory, but anyone
              with the link can still access.
            </span>
            <Toggle
              toggle={this.state.settings.unlist}
              label={"Unlist this server? "}
              onClick={this.handleUnlistToggle}
              critical={true}
            />
          </div>
          Private Listing:
          <div className="toggle-group">
            <span className="info">
              Your server will only be accessible to it's current members. you
              can add new members by giving them an invite link.
            </span>
            <Toggle
              toggle={this.state.settings.private}
              label={"Set server to private? "}
              onClick={this.handlePrivateToggle}
              critical={true}
            />
          </div>
          Phonetic Chat Filter ( experimental ):
          <div className="toggle-group">
            <span className="info">
              {" "}
              Filter chat messages for TTS. Filter will replace problematic
              words with more appropriate ones. Still needs some tuning.
            </span>
            <Toggle
              toggle={this.state.settings.phonetic_filter}
              label={"Apply filter to chat messages? "}
              onClick={this.handlePhoneticFilterToggle}
              critical={false}
            />
          </div>
          Announce New Members in Chat:
          <div className="toggle-group">
            <span className="info">
              Print a message to chat when a new member joins the server.
            </span>
            <Toggle
              toggle={this.state.settings.announce_followers_in_chat}
              label={"Print new member announcements to chat?"}
              onClick={this.handleAnnouceFollowersInChat}
              critical={false}
            />
          </div>
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
