import React from "react";
import Form from "../common/form";

export default class EditMemberForm extends Form {
  state = {
    data: {},
    errors: {},
    error: ""
  };
  schema = {};

  doSubmit = () => {
    console.log("Submitted");
  };

  render() {
    return <div> Fetching Member </div>;
  }
}
