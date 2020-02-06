import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./renameChannel.scss";

export default class RenameChannel extends Form {
  state = {
    data: { channel_name: "" },
    edit: false,
    errors: {},
    error: "",
    edit: false
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
    return <div className="alert">{this.state.error}</div>;
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

  doSubmit = () => {};

  render() {
    const { edit } = this.state;
    const { name } = this.props.channel;
    return (
      <React.Fragment>
        <div className="renameChannel__container">
          <div className="renameChannel__label">Channel Name: </div>
          {edit ? (
            <form onSubmit={this.handleSubmit}>
              <div className="renameChannel__inline-form">
                {this.renderInlineInput("channel_name", "", "inline")}
                {this.renderInlineButton("Update")}
                <button
                  className="renameChannel__action-confirm"
                  onClick={() => this.setState({ edit: !edit })}
                >
                  {" "}
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="renameChannel__content-container">
              <div className="renameChannel__info"> {name}</div>
              <button
                className="renameChannel__edit"
                onClick={() => this.setState({ edit: !edit })}
              >
                {" "}
                edit{" "}
              </button>
            </div>
          )}
        </div>
        {this.handleSubmitError()}
      </React.Fragment>
    );
  }
}
