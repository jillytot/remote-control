import React from "react";
import Form from "../../../common/form";
import Joi from "joi-browser";
import axios from "axios";
import { addRobot } from "../../../../config/client";

export default class AddRobotForm extends Form {
  state = {
    data: { robot_name: "" },
    errors: {},
    error: ""
  };

  schema = {
    robot_name: Joi.string()
      .required()
      .min(3)
      .max(18)
      .regex(/^[a-zA-Z0-9_]*$/)
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
          host_id: server.server_id,
          robot_name: robot_name
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        if (response.data.error) {
          this.setState({ error: response.data.error });
        } else {
          this.setState({ error: "" });
        }
      })
      .catch(err => {
        console.log("Add Server Error: ", err);
      });

    if (this.state.error === "") this.props.onCloseModal();
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
        Setup a new Robot:
        {this.handleSubmitError()}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("robot_name", "Robot Name: ", "text")}
          {this.renderButton("Submit", "Submit")}
        </form>
      </div>
    );
  }
}
