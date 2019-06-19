import React from "react";
import Form from "../../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { addRobot } from "../../../../config/clientSettings";

export default class AddRobotForm extends Form {
  state = {
    data: { robot_name: "" },
    errors: {}
  };

  schema = {
    robot_name: Joi.string()
      .required()
      .min(4)
      .max(25)
      .alphanum()
      .trim()
      .label("Robot Name")
  };

  doSubmit = async () => {
    const { robot_name } = this.state.data;
    const { server } = this.props;
    const token = localStorage.getItem("token");
    console.log("SUBMITTED: ", robot_name, addRobot);

    await axios
      .post(
        addRobot,
        {
          server_id: server.server_id,
          robot_name: robot_name
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .catch(err => {
        console.log("Add Server Error: ", err);
      });

    this.props.onCloseModal();
  };

  render() {
    return (
      <div className="register-form">
        Create a Channel:
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("robot_name", "Robot Name: ", "text")}
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
