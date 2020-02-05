import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./renameChannel.scss";

export default class RenameChannel extends Form {
  state = {
    data: { channel_name: "" },
    edit: false,
    errors: {},
    error: ""
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

  doSubmit = () => {};

  render() {
    return (
      <React.Fragment>
        <div className="renameChannel__container">
          <div className="renameChannel__label">Channel Name: </div>

          <form onSubmit={this.handleSubmit}>
            <div className="renameChannel__inline-form">
              {this.renderInput("channel_name", "", "inline")}
              {this.renderButton("Update")}
            </div>
          </form>
        </div>
        {this.handleSubmitError()}
      </React.Fragment>
    );
  }
}
