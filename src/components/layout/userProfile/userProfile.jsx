import React, { Component } from "react";
import axios from "axios";
import "./userProfile.scss";
import { userProfile } from "../../../config/client/index";
import EditEmail from "./editEmail";
import LinkPatreon from "../../forms/LinkPatreon/LinkPatreon";
import VerifyEmail from "../../forms/verifyEmail/verifyEmail";

export default class UserProfile extends Component {
  state = {
    fetching: true,
    submitText: "Update",
    userData: {},
    editEmail: false,
    editEmailText: "( edit )",
    updated: ""
  };

  componentDidMount() {
    this.handleGetInfo();
    // console.log(this.props.locationSearch);
  }

  handleUpdateEmail = async () => {
    // console.log("Update Email");
  };

  handleGetInfo = async () => {
    const token = localStorage.getItem("token");

    await axios
      .post(
        userProfile,
        {},
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        // console.log("Response Data: ", response.data);
        if (!response.data.error || !response.error) {
          this.setState({ fetching: false, userData: response.data });
          // console.log(response.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleProfileUpdated = () => {
    this.handleGetInfo();
  };

  handleFetching = () => {
    return <div className="infos"> Fetching Infos ...</div>;
  };

  doSubmit = async () => {
    this.props.onCloseModal();
  };

  handleShowInfo = () => {
    const { editEmail } = this.state;
    const { email, username, created, id, status } = this.state.userData;
    const date = new Date(parseInt(created)).toDateString();

    return (
      <div>
        <div className="userProfile__info-group-container">
          <div className="userProfile__info-container">
            <div className="userProfile__info-key"> username: </div>
            <div className="userProfile__info-value"> {username} </div>
          </div>
          <div className="userProfile__info-container">
            <div className="userProfile__info-key"> user id: </div>
            <div className="userProfile__info-value"> {id} </div>
          </div>
          <div className="userProfile__info-container">
            <div className="userProfile__info-key"> created: </div>
            <div className="userProfile__info-value"> {date} </div>
          </div>
          <div className="userProfile__info-container">
            <div className="userProfile__info-key"> email: </div>
            <div className="userProfile__info-value"> {email} </div>
            <button
              className="userProfile__info-edit"
              onClick={() => {
                this.setState({ editEmail: !editEmail });
                if (!editEmail) this.setState({ updated: "" });
              }}
            >
              {editEmail ? "( cancel )" : "( edit )"}
            </button>
          </div>
          {editEmail ? this.handleEditEmail() : <React.Fragment />}
          <VerifyEmail status={status} />

          {this.handleDisplayPatreon()}
        </div>
      </div>
    );
  };

  handleDisplayPatreon = () => {
    return (
      <LinkPatreon
        {...this.state.userData}
        {...this.props} //Never do this again, keep it strict!
        onProfileUpdated={this.handleProfileUpdated}
      />
    );
  };

  handleUpdated = e => {
    // console.log(e);
    this.setState({ userData: e, updated: e.message });
    if (e.email) this.setState({ editEmail: false });
  };

  handleEditEmail = () => {
    return (
      <EditEmail
        updated={e => {
          this.handleUpdated(e);
        }}
      />
    );
  };

  handleUpdateStatus = () => {
    const { updated, editEmail } = this.state;
    if (updated !== "" && !editEmail) {
      return <div className="userProfile__updated">{updated}</div>;
    }
    return <React.Fragment />;
  };

  render() {
    const { user } = this.props;
    const { fetching } = this.state;
    // console.log(user);
    return (
      <div className="modal">
        {user.username}'s profile.
        {fetching ? this.handleFetching() : this.handleShowInfo()}{" "}
        {this.handleUpdateStatus()}
      </div>
    );
  }
}
