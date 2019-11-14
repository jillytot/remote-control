import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import "./userProfile.css";
import { userProfile } from "../../../config/client/index";

export default class UserProfile extends Form {
  state = {
    data: { email: "" },
    errors: {},
    error: "",
    submitText: "Update",
    fetching: true,
    submitText: "Update",
    userData: {},
    editEmail: false
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
    const token = localStorage.getItem("token");

    axios
      .post(
        userProfile,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        console.log("Response Data: ", response.data);
        if (!response.data.error || !response.error) {
          this.setState({ fetching: false, userData: response.data });
        }
      })
      .catch(err => {
        console.log(err);
      });
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

  handleEditEmail = () => {
    const { submitText } = this.state;
    return (
      <React.Fragment>
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email", "email")}
          {this.renderButton(submitText)}
        </form>
      </React.Fragment>
    );
  };

  handleShowInfo = () => {
    const { editEmail } = this.state;
    const { email, username, created, id } = this.state.userData;

    return (
      <div>
        <div className="info-chunk">
          <div className="info-container">
            <div className="info-key"> username: </div>
            <div className="info-value"> {username} </div>
          </div>
          <div className="info-container">
            <div className="info-key"> user id: </div>
            <div className="info-value"> {id} </div>
          </div>
          <div className="info-container">
            <div className="info-key"> created: </div>
            <div className="info-value"> {created} </div>
          </div>
          <div className="info-container">
            <div className="info-key"> email: </div>
            <div className="info-value"> {email} </div>
            <div className="info-edit"> ( edit ) </div>
          </div>
          <div className="info-container">
            <div className="info-key"> email verified: </div>
            <div className="info-value"> nope </div>
            <div className="info-edit"> ( verify ) </div>
          </div>
        </div>
        {editEmail ? this.handleEditEmail() : <React.Fragment />}
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { fetching } = this.state;
    console.log(user);
    return (
      <div className="modal">
        {user.username}'s profile.
        {fetching ? this.handleFetching() : this.handleShowInfo()}{" "}
      </div>
    );
  }
}
