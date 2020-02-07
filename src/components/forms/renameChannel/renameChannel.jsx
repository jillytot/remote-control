import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { renameChannel } from "../../../config/client/index";
import "./renameChannel.scss";

export default class RenameChannel extends Form {
  state = {
    data: { channel_name: "" },
    edit: false,
    errors: {},
    error: "",
    edit: false,
    status: ""
  };

  componentDidMount() {
    this.setState({ data: { channel_name: this.props.channel.name } });
  }

  schema = {
    channel_name: Joi.string()
      .required()
      .min(3)
      .max(18)
      .regex(/^[a-zA-Z0-9_]*$/)
      .trim()
      .label("Channel Name")
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return (
      <div className="renameChannel__alert">
        <div className="renameChannel__alert-message">{this.state.error}</div>
        <button
          className="renameChannel__dismiss"
          onClick={() => this.setState({ error: "" })}
        >
          dismiss
        </button>
      </div>
    );
  };

  renderInlineButton = label => {
    //require validation?
    if (this.state.validation === true) {
      return (
        <button className="renameChannel__action" disabled={this.validate()}>
          {label}
        </button>
      );
    }
    return <button className="renameChannel__action">{label}</button>;
  };

  doSubmit = async () => {
    const token = localStorage.getItem("token");
    this.setState({ status: "...Sending Request." });
    await axios
      .post(
        renameChannel,
        {
          id: this.props.channel.id,
          name: this.state.data.channel_name
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log("Update Channel Response: ", response);
        if (response.data.error)
          this.setState({ error: response.data.error, status: "" });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleEdit = () => {
    const { edit, status } = this.state;
    const { channel_name } = this.state.data;
    if (status !== "") {
      return (
        <div className="renameChannel__content-container">
          <div className="renameChannel__info"> {channel_name}</div>
          <div className="renameChannel__info"> {status}</div>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="renameChannel__inline-form">
          {this.renderInlineInput("channel_name", "", "inline")}
          {this.renderInlineButton("Update")}
          <button
            className="renameChannel__action-confirm"
            onClick={() => this.setState({ edit: !edit })}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  render() {
    const { edit } = this.state;
    const { name } = this.props.channel;
    return (
      <React.Fragment>
        <div className="renameChannel__container">
          <div className="renameChannel__label">Channel Name: </div>
          {edit ? (
            this.handleEdit()
          ) : (
            <div className="renameChannel__content-container">
              <div className="renameChannel__info"> {name}</div>
              <button
                className="renameChannel__edit"
                onClick={() => this.setState({ edit: !edit, error: "" })}
              >
                edit
              </button>
            </div>
          )}
        </div>
        {this.handleSubmitError()}
      </React.Fragment>
    );
  }
}
