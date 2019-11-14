import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import "./userProfile.css";

export default class UserProfile extends Form {
  state = {
    data: { email: "" },
    errors: {},
    error: "",
    submitText: "Update",
    fetching: true,
    submitText: "Update"
  };

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Email")
  };

  componentDidMount() {
    this.handleGetInfo();
  }

  handleUpdateEmail = async () => {
    console.log("Update Email");
  };

  handleGetInfo = async () => {
    console.log("Get Info");
  };

  handleFetching = () => {
    return <div className="infos"> Fetching Infos ...</div>;
  };

  doSubmit = async () => {
    this.props.onCloseModal();
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  handleShowInfo = () => {
    const { submitText } = this.state;
    return (
      <div>
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email", "email")}
          {this.renderButton(submitText)}
        </form>
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { fetching } = this.state;
    console.log(user);
    return (
      <div className="modal">
        {" "}
        {user.username}'s profile.
        {fetching ? this.handleFetching() : this.handleShowInfo()}{" "}
      </div>
    );
  }
}
