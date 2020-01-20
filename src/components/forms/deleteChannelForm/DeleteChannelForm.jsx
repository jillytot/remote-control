import React, { Component } from "react";
import axios from "axios";
import { deleteChannel } from "../../../config/client";
import Confirm from "../../common/confirm/index";
import "./DeleteChannelForm.scss";

export default class DeleteChannelForm extends Component {
  state = {
    displayConfirm: false, //Toggle Confirm
    displayPending: false,
    displaySuccess: "", //Response Message
    displayError: false
  };

  handleDelete = async () => {
    const token = localStorage.getItem("token");
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

  render() {
    const {
      displayConfirm,
      displayPending,
      displaySuccess,
      displayError
    } = this.state;
    return (
      <React.Fragment>
        <div className="DeleteChannelForm__container">
          <div className="DeleteChannelForm__label"> Delete Channel: </div>

          <div
            className="DeleteChannelForm__action"
            onClick={() => {
              this.setState({ displayConfirm: !displayConfirm });
            }}
          >
            Delete
          </div>
        </div>
        {displayConfirm ? (
          <Confirm
            confirmText="Delete Channel" //What is the action being confirmed?
            displayConfirm={displayConfirm}
            displayPending={displayPending}
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
            onComplete={this.handleComplete}
            displaySuccess={displaySuccess}
            displayError={displayError}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
