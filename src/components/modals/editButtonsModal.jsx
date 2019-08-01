import React, { Component } from "react";
import "../../styles/common.css";
import Joi from "joi-browser";
import { robotAPIKey } from "../../config/clientSettings";
import Form from "../common/form";
import "./editButtons.css";

import axios from "axios";

export default class EditButtonsModal extends Form {
  state = {
    data: {
      submitJSON: ""
    },
    populate: "",
    errors: {}
  };

  componentDidMount() {
    this.setState({ populate: JSON.stringify(this.props.controls) });
  }

  setError = error => {
    this.setState({ error });
  };

  doSubmit = () => {
    console.log("Submit");
    this.handleSubmit("boop");
  };

  schema = {
    submitJSON: Joi.object()
      .required()
      .label("submitJSON")
  };

  handleGetAPIKey = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        robotAPIKey,
        {
          robot_id: null
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        this.setState({ apiKey: res.data.key });
      })
      .catch(err => {
        console.log("Problem Fetching Key", err);
      });
  };

  handleButtonType = label => {
    if (label === "Delete Robot") {
      console.log(label);
      return "btn btn-delete";
    } else {
      return "btn";
    }
  };

  renderButton = label => {
    //require validation?
    return (
      <button
        className={this.handleButtonType(label)}
        onClick={e => this.handleDelete(e)}
      >
        {label}
      </button>
    );
  };

  render() {
    return (
      <div className="register-form spacer">
        Upload a JSON file to customize your buttons:
        <div> </div>
        <div className="">
          {this.renderTextArea(
            "submitJSON",
            "",
            "JSON",
            this.state.populate,
            30,
            70
          )}
        </div>
        {this.renderButton("Upload")}
      </div>
    );
  }
}
