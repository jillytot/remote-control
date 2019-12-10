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
    console.log(this.props);
    const { username } = this.props.member;
    return (
      <React.Fragment>
        <div> {username}</div>
      </React.Fragment>
    );
  }
}
