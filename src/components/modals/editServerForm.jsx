import React from "react";
import Form from "../common/form";
import Toggle from "../common/toggle";
import axios from "axios";
import { setServerListing } from "../../config/clientSettings";

export default class EditServerForm extends Form {
  state = {
    data: {},
    errors: {},
    settings: { unlist: null },
    compareSettings: { unlist: null },
    error: ""
  };
  schema = {};

  componentDidMount() {
    this.setState({
      settings: this.props.server.settings,
      compareSettings: this.props.server.settings
    });
  }

  handleToggle = () => {
    let { settings } = this.state;
    settings.unlist = !settings.unlist;
    this.setState({ settings: settings });
  };

  listingObject = () => {
    console.log(this.props.server.server_id);
    return {
      server: {
        server_id: this.props.server.server_id,
        settings: {
          unlist: this.state.settings.unlist
        }
      }
    };
  };

  handleListing = async token => {
    //  if (this.state.settings.unlist !== this.state.compareSettings.unlist) {
    console.log("Ding");
    await axios
      .post(setServerListing, this.listingObject(), {
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
    await Promise.all([this.handleListing(token)]);
    this.props.onCloseModal();
  };

  render() {
    return (
      <div className="register-form">
        Editing Server:{" "}
        <span className="register-form-emphasis">
          {this.props.server.server_name}
        </span>
        <br />
        <form onSubmit={this.handleSubmit}>
          Public Listing
          <div className="toggle-group">
            <span className="info">
              {" "}
              Server will be listed in the public directory unless otherwise
              specified{" "}
            </span>
            <Toggle
              toggle={this.state.settings.unlist}
              label={"Unlist this server? "}
              onClick={this.handleToggle}
              critical={true}
            />
          </div>
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
