import React from "react";
import Icon from "../../common/icon";
import { ICONS } from "../../../icons/icons";
import "../../common/overlay.css";
import "../../../styles/common.css";
import Form from "../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { apiUrl } from "../../../config/clientSettings";

export default class AddServer extends React.Component {
  state = {};

  handleModal = () => {
    return [
      {
        body: <AddServerForm onCloseModal={this.props.onCloseModal} />
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    return (
      <div className="display-robot-server-container align-add-server">
        <div
          className="add-server "
          onClick={() => {
            this.props.modal(this.handleModal());
          }}
        >
          <Icon icon={ICONS.PLUS} className="display-robot-server-img" />
        </div>
        <div className="display-robot-server">add server</div>
      </div>
    );
  }
}

class AddServerForm extends Form {
  state = {
    data: { server: "" },
    errors: {}
  };

  schema = {
    server: Joi.string()
      .required()
      .min(4)
      .max(25)
      .alphanum()
      .trim()
      .label("Robot Server Name")
  };

  async componentDidMount() {
    //Just a test to see my API stuff is working
    await axios
      .get(apiUrl)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  doSubmit = async () => {
    console.log("SUBMITTED");
    this.props.onCloseModal();

    //Call the server
  };

  render() {
    return (
      <div className="register-form">
        Setup a robot Server:
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("server", "Server Name: ", "text")}
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
