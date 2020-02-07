import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { renameChannel } from "../../../config/client/index";
import InlineResponse from "../../common/inlineResult/inlineResult";
import "./renameChannel.scss";

export default class RenameChannel extends Form {
  state = {
    data: { channel_name: "" },
    edit: false,
    errors: {},
    error: "",
    status: "",
    success: ""
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

  handleCloseResponse = () => {
    this.setState({ error: "", success: "", returnError: "" });
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
    const { onChange } = this.props;
    this.setState({ status: "...Sending Request.", edit: false });
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
        else {
          this.setState({
            success: "Channel name updated successfully!",
            status: ""
          });
          onChange(response.data.name);
        }
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
    const { displayName } = this.props;
    return (
      <React.Fragment>
        <div className="renameChannel__container">
          <div className="renameChannel__label">Channel Name: </div>
          {edit ? (
            this.handleEdit()
          ) : (
            <div className="renameChannel__content-container">
              <div className="renameChannel__info"> {displayName}</div>
              <button
                className="renameChannel__edit"
                onClick={() =>
                  this.setState({
                    edit: !edit,
                    error: "",
                    data: { channel_name: displayName }
                  })
                }
              >
                edit
              </button>
            </div>
          )}
        </div>
        {this.handleSubmitResponse()}
        {edit && this.state.returnError ? (
          <InlineResponse message={this.state.returnError} />
        ) : null}
      </React.Fragment>
    );
  }
}
