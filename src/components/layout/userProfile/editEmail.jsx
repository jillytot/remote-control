import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import "./editEmail.scss";
import axios from "axios";
import { updateEmail } from "../../../config/client/index";

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

    if (error === "success") {
      return <div className="editEmail__inline-success">Updated!</div>;
    } else {
      return <div className="editEmail__inline-alert">{this.state.error}</div>;
    }
  };

  handleUpdateEmail = async () => {
    const { email } = this.state.data;
    const { updated } = this.props;
    const token = localStorage.getItem("token");

    await axios
      .post(
        updateEmail,
        { email: email },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        if (response.data.email) {
          this.setState({ error: "success" });
          updated({
            ...response.data,
            message: "( Email Successfully Updated! )"
          });
        }

        if (response.data.error) {
          this.setState({ error: response.data.error });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
    return null;
  };

  doSubmit = async () => {
    this.setState({ error: "" });
    await this.handleUpdateEmail();
  };

  render() {
    const { submitText, returnError, error } = this.state;
    return (
      <div>
        {this.handleSubmitError()}
        {returnError && error !== "success" ? (
          <div className="editEmail__inline-alert">{returnError}</div>
        ) : (
          <React.Fragment />
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="editEmail__inline">
            {this.renderInput("email", "New Email", "inline")}
            {this.renderButton(submitText)}
          </div>
        </form>
      </div>
    );
  }
}
