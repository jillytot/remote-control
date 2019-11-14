import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";

export default class EditEmail extends Form {
  state = {
    data: { email: "" },
    errors: {},
    error: "",
    submitText: "Update",
    inline: "true"
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
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
    const { email } = this.state.data;
    if (email === "") {
      this.setState({ error: "Email cannot be blank" });
      return;
    }
    this.props.updated("Email Updated!");
  };

  render() {
    const { submitText } = this.state;
    return (
      <div>
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          <div className="inline">
            {this.renderInput("email", "New Email", "inline")}
            {this.renderButton(submitText)}
          </div>
        </form>
      </div>
    );
  }
}
