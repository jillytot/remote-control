import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./userProfile.css";

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
    return <div className="alert-inline">{this.state.error}</div>;
  };

  handleUpdateEmail = async () => {
    const { email } = this.state.data;
    console.log("Updating Email", email);
    return null;
  };

  doSubmit = async () => {
    const { error } = this.state;
    this.setState({ error: "" });
    await this.handleUpdateEmail();
    if (!error) {
      this.props.updated("Email Updated!");
    }
  };

  render() {
    const { submitText, returnError } = this.state;
    return (
      <div>
        {this.handleSubmitError()}
        {returnError ? (
          <div className="alert-inline">{returnError}</div>
        ) : (
          <React.Fragment />
        )}
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
