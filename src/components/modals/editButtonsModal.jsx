import React from "react";
import "../../styles/common.css";
import Joi from "joi-browser";
import { getButtons, makeButtons } from "../../config/client";
import Form from "../common/form";
import "./editButtons.css";

import axios from "axios";

export default class EditButtonsModal extends Form {
  state = {
    data: {
      submitJSON: ""
    },
    errors: {},
    error: ""
  };

  async componentDidMount() {
    await this.handleGetButtons();
  }

  handleGetButtons = async () => {
    const token = localStorage.getItem("token");
    console.log("GET BUTTONS", this.props.channel);
    console.log(token);
    await axios
      .post(
        getButtons,
        {
          channel_id: this.props.channel
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          data: { submitJSON: JSON.stringify(this.handleCleanText(res.data)) }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCleanText = buttons => {
    let clean = [];
    buttons.map(button => {
      delete button.id;
      clean.push(button);
    });
    return clean;
  };

  setError = error => {
    this.setState({ error });
  };

  doSubmit = async () => {
    let make = [];
    try {
      make = JSON.parse(this.state.data.submitJSON);
      if (make.length < 1) make = [{ break: "line", label: "", id: "1" }];
    } catch (err) {
      console.log(err);
      this.setState({ error: "Invalid JSON" });
      return;
    }

    const token = localStorage.getItem("token");
    console.log("GET BUTTONS", this.props.channel);
    console.log(token);
    await axios
      .post(
        makeButtons,
        {
          channel_id: this.props.channel,
          buttons: make
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log(res);
        if (res.data.error) {
          console.log("ERROR! ", res.data.error);
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.props.onCloseModal();
  };

  schema = {
    submitJSON: Joi.string().label("submitJSON")
  };

  handleButtonType = label => {
    if (label === "Delete Robot") {
      console.log(label);
      return "btn btn-delete";
    } else {
      return "btn";
    }
  };

  handleSubmitError = () => {
    const { error } = this.state;
    if (error === "") {
      return <React.Fragment />;
    }
    return <div className="alert">{this.state.error}</div>;
  };

  render() {
    return (
      <div className="modal">
        Edit the JSON file to customize your buttons:
        <div> </div>
        <form onSubmit={this.handleSubmit}>
          <div className="">
            {this.renderTextArea(
              "submitJSON",
              "",
              "JSON",
              this.state.data.submitJSON,
              30,
              70
            )}
          </div>
          {this.handleSubmitError()}
          {this.renderButton("Upload")}
        </form>
      </div>
    );
  }
}
