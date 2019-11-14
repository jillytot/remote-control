import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";

export default class EditEmail extends Form {
  state = {
    data: { email: "" },
    errors: {},
    error: "",
    submitText: "Update"
  };

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Email")
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  doSubmit = () => {
    this.props.updated("Email Updated!");
  };

  render() {
    const { submitText } = this.state;
    return (
      <div>
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit} inline="true">
          {this.renderInput("email", "New Email", "email")}
          {this.renderButton(submitText)}
        </form>
      </div>
    );
  }
}
