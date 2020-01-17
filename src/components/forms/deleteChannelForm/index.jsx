import React, { Component } from "react";
import axios from "axios";
import { deleteChannel } from "../../../config/client";
import Confirm from "../../common/confirm/index";
import "../inlineForms.css";

export default class DeleteChannel extends Component {
  state = {
    displayConfirm: false,
    displayPending: false,
    displaySuccess: "",
    displayError: false
  };

  handleDelete = async () => {
    const token = localStorage.getItem("token");
    console.log("SUBMITTED: ", this.props);

    await axios
      .post(
        deleteChannel,
        {
          channel_id: this.props.channel.id,
          server_id: this.props.channel.host_id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        // console.log("Delete Channel Response: ", res.data);
        if (res.data.error) {
          this.setState({
            displaySuccess: res.data.error,
            displayError: true
          });
          return;
        } else {
          this.setState({ displaySuccess: "Channel Successfully Deleted." });
          this.props.onDeleted();
          return;
        }
      })
      .catch(err => {
        console.log("Add Server Error: ", err);
      });
  };

  handleConfirm = async () => {
    this.setState({ displayPending: true });
    await this.handleDelete();
  };

  handleComplete = () => {
    // const { onUpdated } = this.props;
    this.setState({
      displayConfirm: false,
      displayPending: false,
      displaySuccess: ""
    });

    // onUpdated(); //Update Parent component
  };

  handleCancel = () => {
    this.setState({
      displayConfirm: false,
      displayPending: false
    });
  };

  handleDisplayConfirm = () => {
    const {
      displayConfirm,
      displayPending,
      displaySuccess,
      displayError
    } = this.state;
    if (displayConfirm) {
      return (
        <Confirm
          input="Delete Channel" //What is the action being confirmed?
          displayConfirm={displayConfirm}
          displayPending={displayPending}
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          onComplete={this.handleComplete}
          displaySuccess={displaySuccess}
          displayError={displayError}
        />
      );
    }
    return <React.Fragment />;
  };

  handleDisplay = () => {
    const { displayConfirm } = this.state;
    return (
      <React.Fragment>
        <div className="inline-container">
          <div className="inline-label label-danger"> Delete Channel: </div>
          <div className="inline-info" />
          <div className="inline-spacer" />
          <div
            className="inline-action"
            onClick={() => {
              this.setState({ displayConfirm: !displayConfirm });
            }}
          >
            Delete
          </div>
        </div>
        {this.handleDisplayConfirm()}
      </React.Fragment>
    );
  };

  render() {
    return this.handleDisplay();
  }
}
